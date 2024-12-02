import { DataTypes, Model } from "@denodb";
import { getNovel, isUrlSupported } from "./crawler/mod.ts";
import { FieldValue, Values } from "@denodb/types";
import translate from "./translate.ts";
import { Article } from "./article.ts";

type state =
  | "unfetch"
  | "fetching"
  | "fetched"
  | "translating"
  | "translated"
  | "error";

export class Novel extends Model {
  static table = "novel";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    url: DataTypes.string(256),
    name: DataTypes.string(64),
    state: DataTypes.STRING,
    description: DataTypes.string(4 * 1024),
    author: DataTypes.string(256),
    untranslatedDescription: DataTypes.string(4 * 1024),
    hidden: DataTypes.BINARY,
  };
  static defaults = {
    name: "",
    description: "",
    author: "",
    untranslatedDescription: "",
    state: "unfetch",
    hidden: false,
  };
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
    return await Novel.create({
      url,
    }) as Novel;
  }
  /**
   * advance state from unfetch to fetching
   * @returns might throw error if transition is invalid
   */
  async fetch(): Promise<Novel | undefined> {
    this.changeState("unfetch", "fetching");
    const result = await getNovel(this.url as string);
    if (!result) return;

    await Promise.all(
      result.chapters.map((metadata) =>
        Article.fromMetadata(metadata, this.id as number)
      ),
    );

    await this.changeState("fetching", "fetched", {
      name: result.name,
      untranslatedDescription: result.description,
      author: result.author,
    });
  }
  async translate() {
    this.changeState("fetched", "translating");
    const translated = await translate(this.untranslatedDescription as string);
    await this.changeState("translating", "translated", {
      description: translated,
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
  public async oneShot() {
    if (this.state == "unfetch") {
      await this.fetch().catch((e) => this.setErrorState("fetching", e));
    }
    if (this.state == "fetched") {
      await this.translate().catch((e) => this.setErrorState("fetching", e));
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
}
