import { DataTypes, Model } from "@denodb";
import { FieldValue, Values } from "@denodb/types";
import translate from "./translate.ts";

import { ArticleMetaData, getArticle } from "./crawler/mod.ts";

type state =
  | "unfetch"
  | "fetching"
  | "fetched"
  | "translating"
  | "translated"
  | "error";

export class Article extends Model {
  static table = "article";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: DataTypes.string(64),
    url: DataTypes.STRING,
    state: DataTypes.STRING,
    untranslatedContent: DataTypes.STRING,
    content: DataTypes.STRING,
    index: DataTypes.INTEGER,
  };
  private metadata(): ArticleMetaData {
    return {
      title: this.title as string,
      url: this.url as string,
      index: this.index as number,
    };
  }
  static getById(id: number) {
    return this.where("id", id).get() as Promise<Article>;
  }
  static async fromMetadata(metadata: ArticleMetaData): Promise<Article> {
    return await Article.create({
      url: metadata.url,
      state: "unfetch",
      title: metadata.title,
      index: metadata.index,
    }) as Article;
  }
  async fetch(): Promise<Article | undefined> {
    this.changeState("unfetch", "fetching");
    const result = await getArticle(this.metadata());
    if (!result) return;

    await this.changeState("fetching", "fetched", {
      untranslatedContent: result.content,
    });
  }
  async translate() {
    this.changeState("fetched", "translating");
    const translated = await translate(this.untranslatedContent as string);
    await this.changeState("translating", "translated", {
      content: translated,
    });
  }
  private async changeState(oldState: state, newState: state, values?: Values) {
    if (oldState !== this.state) throw new Error("Invalid state transition");
    for (const key in values) this[key] = values[key];

    await Article.where("id", this.id as FieldValue).where("state", oldState)
      .update({ state: newState, ...values });
    this.state = newState;
  }
}

await Promise.all([
  Article.where("state", "fetching").update({
    state: "unfetch",
  }),
  Article.where("state", "translating").update({
    state: "fetched",
  }),
]);
