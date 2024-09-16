import { DataTypes, Model } from "@denodb";
import { getNovel } from "./crawler/mod.ts";
import { FieldValue, Values } from "@denodb/types";
import translate from "./translate.ts";

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
    url: DataTypes.STRING,
    name: DataTypes.string(64),
    state: DataTypes.STRING,
    description: DataTypes.STRING,
    author: DataTypes.STRING,
    untranslatedDescription: DataTypes.STRING,
  };
  static getById(id: number) {
    return this.where("id", id).get() as Promise<Novel>;
  }
  static async fromUrl(url: string): Promise<Novel | undefined> {
    return await Novel.create({
      url,
      state: "unfetch",
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
  private async changeState(oldState: state, newState: state, values?: Values) {
    if (oldState !== this.state) throw new Error("Invalid state transition");
    for (const key in values) this[key] = values[key];

    await Novel.where("id", this.id as FieldValue).where("state", oldState)
      .update({ state: newState, ...values });
    this.state = newState;
  }
}

await Promise.all([
  Novel.where("state", "fetching").update({
    state: "unfetch",
  }),
  Novel.where("state", "translating").update({
    state: "fetched",
  }),
]);
