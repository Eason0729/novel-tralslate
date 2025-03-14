import { DataTypes, Model } from "@denodb";
import { getNovelSourceByUrl, isUrlSupported } from "./crawler/mod.ts";
import { FieldValue, Values } from "@denodb/types";
import { Article } from "./article.ts";
import { getTranslatorHandle } from "./translater/mod.ts";

type state =
  | "unfetch"
  | "fetching"
  | "fetched"
  | "translating"
  | "translated"
  | "error";

export class Novel extends Model {
  static override table = "novel";
  static override timestamps = true;
  static override fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    url: DataTypes.string(256),
    name: DataTypes.string(64),
    untranslatedName: DataTypes.string(64),
    state: DataTypes.STRING,
    description: DataTypes.string(4 * 1024),
    author: DataTypes.string(256),
    untranslatedDescription: DataTypes.string(4 * 1024),
    hidden: DataTypes.BINARY,
  };
  static override defaults = {
    name: "",
    description: "",
    author: "",
    untranslatedDescription: "",
    untranslatedName: "",
    state: "unfetch",
    hidden: false,
  };
  // FIXME: migrate to repository pattern
  private static async _createOverride(url: string): Promise<Novel> {
    await Novel.create({
      url,
    });
    const novels = await Novel.where("url", url).all() as Novel[];
    return novels[0];
  }
  static async getById(id: number): Promise<Novel | undefined> {
    return (await this.where("id", id).get() as Novel[])?.[0];
  }
  static async fromUrl(url: string): Promise<Novel | undefined> {
    if (!isUrlSupported(url)) {
      throw new Error(`invalid url: "${url}"`);
    }

    const novels = await Novel.where("url", url).all() as Novel[];
    if (novels.length > 0) {
      if (novels[0].hidden) novels[0].show();
      return novels[0];
    }
    return Novel._createOverride(url);
  }
  /**
   * advance state from unfetch to fetching
   * @returns might throw error if transition is invalid
   */
  async fetch(): Promise<Novel | undefined> {
    await this.changeState("unfetch", "fetching");
    const source = getNovelSourceByUrl(this.url as string);
    const result = source
      ? await source.get_novel(this.url as string)
      : undefined;
    if (!result) return;

    await Promise.all(
      result.chapters.map((metadata) =>
        Article.fromMetadata(metadata, this.id as number)
      ),
    );

    await this.changeState("fetching", "fetched", {
      untranslatedName: result.name,
      untranslatedDescription: result.description,
      author: result.author,
    });
  }
  async translate() {
    await this.changeState("fetched", "translating");

    const source = getNovelSourceByUrl(this.url as string);
    const lang = source?.language;
    if (!lang) throw new Error("no language found");

    const translater = getTranslatorHandle(lang);
    if (!translater) throw new Error("no translater found");

    const [description, name] = await translater.translate(
      [this.untranslatedDescription, this.untranslatedName] as string[],
    );

    await this.changeState("translating", "translated", {
      description,
      name,
    });
  }
  static articles() {
    return this.hasMany(Article);
  }
  public async show() {
    await Novel.where("id", this.id as FieldValue).update({ hidden: false });
  }
  public async hide() {
    await Novel.where("id", this.id as FieldValue).update({ hidden: true });
  }
  public async reset() {
    if (["fetched", "translated", "error"].includes(this.state as string)) {
      await this.changeState(this.state as state, "unfetch");
    }
  }
  public async oneShot() {
    try {
      if (this.state == "unfetch") await this.fetch();
      if (this.state == "fetched") await this.translate();
    } catch (e) {
      this.setErrorState(this.state as state, e as Error);
    }
  }
  private async changeState(oldState: state, newState: state, values?: Values) {
    if (oldState !== this.state) throw new Error("state mismatch");
    for (const key in values) this[key] = values[key];

    await Novel.where("id", this.id as FieldValue).where("state", oldState)
      .update({ state: newState, ...values });
    this.state = newState;
  }
  private async setErrorState(oldState: state, e: Error) {
    console.warn(e);
    try {
      await this.changeState(oldState, "error");
    } catch (e) {
      console.warn("error while setting error state", e);
    }
  }
  public static async resetInProgress() {
    await Novel.where("state", "fetching").update({ state: "unfetch" });
    await Novel.where("state", "translating").update({ state: "fetched" });
  }
}
