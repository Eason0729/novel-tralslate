import { DataTypes, Model } from "@denodb";
import { FieldValue, Values } from "@denodb/types";

import { ArticleMetaData, getArticle } from "./crawler/mod.ts";
import { Novel } from "./novel.ts";
import { getTranslator } from "./translater/mod.ts";

export type State =
  | "unfetch"
  | "fetching"
  | "fetched"
  | "translating"
  | "translated"
  | "error";

export class Article extends Model {
  static override table = "article";
  static override timestamps = true;
  static override fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: DataTypes.string(128),
    url: DataTypes.string(256),
    state: DataTypes.STRING,
    untranslatedContent: DataTypes.string(64 * 1024),
    content: DataTypes.string(64 * 1024),
    index: DataTypes.INTEGER,
  };
  static override defaults = {
    url: "",
    state: "unfetch",
    untranslatedContent: "",
    content: "",
  };
  private metadata(): ArticleMetaData {
    return {
      title: this.title as string,
      url: this.url as string,
      index: this.index as number,
    };
  }
  static async getById(id: number): Promise<Article | undefined> {
    return (await this.where("id", id).get() as Article[])?.[0];
  }
  static async fromMetadata(
    metadata: ArticleMetaData,
    novelId: number,
  ): Promise<Article> {
    return await Article.create({
      url: metadata.url,
      title: metadata.title,
      index: metadata.index,
      novelId,
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

    const translater = getTranslator(this.url as string);
    if (!translater) throw new Error("no translater found");

    const translated = await translater?.translate(
      this.untranslatedContent as string,
    );
    await this.changeState("translating", "translated", {
      content: translated,
    });
  }
  static novel() {
    return this.hasOne(Novel);
  }
  public async reset() {
    if (this.state == "fetched" || this.state == "translated") {
      await this.changeState(this.state, "unfetch");
    }
  }
  public async oneShot() {
    if (this.state == "unfetch") {
      await this.fetch().catch((e) => this.setErrorState("fetching", e));
    }
    if (this.state == "fetched") {
      await this.translate().catch((e) => this.setErrorState("fetching", e));
    }
  }
  private async changeState(oldState: State, newState: State, values?: Values) {
    if (oldState !== this.state) throw new Error("state mismatch");
    for (const key in values) this[key] = values[key];

    await Article.where("id", this.id as FieldValue).where("state", oldState)
      .update({ state: newState, ...values });
    this.state = newState;
  }
  private async setErrorState(oldState: State, e: Error) {
    console.warn(e);
    try {
      await this.changeState(oldState, "error");
    } catch (e) {
      console.warn("error while setting error state", e);
    }
  }
}
