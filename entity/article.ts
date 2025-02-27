import { DataTypes, Model } from "@denodb";
import { FieldValue, Values } from "@denodb/types";

import { ArticleMetaData, getArticleSourceByMetadata } from "./crawler/mod.ts";
import { Novel } from "./novel.ts";
import { getTranslatorHandle } from "./translater/mod.ts";

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
    untranslatedTitle: DataTypes.string(128),
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
    untranslatedTitle: "",
    title: "",
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
    const articles = await Article.where("novelId", novelId).where(
      "index",
      metadata.index,
    ).all();
    if (articles.length > 0) return articles[0] as Article;

    return await Article.create({
      url: metadata.url,
      untranslatedTitle: metadata.title,
      index: metadata.index,
      novelId,
    }) as Article;
  }
  async upgrade() {
    const articles = await Article.where("id", this.id as number).all();
    if (articles.length != 1) {
      throw new Error(
        "row is delete in database before upgrading parital model",
      );
    }
    Object.assign(this, articles[0] as Article);
  }
  async fetch() {
    await this.changeState("unfetch", "fetching");
    const source = getArticleSourceByMetadata(this.metadata());
    const result = source ? await source.getArticle(this.metadata()) : null;
    if (!result) {
      throw new Error(
        "fetch failed, maybe fetcher is not available(but were available before)",
      );
    }

    await this.changeState("fetching", "fetched", {
      untranslatedContent: result.content,
    });
  }
  async translate() {
    await this.changeState("fetched", "translating");
    const source = getArticleSourceByMetadata(this.metadata());

    const lang = source?.language;
    if (!lang) throw new Error("no language found");

    const translater = getTranslatorHandle(lang);

    if (!translater) throw new Error("no translater found");

    const [content, title] = await translater?.translate(
      [this.untranslatedContent, this.untranslatedTitle] as string[],
    );
    await this.changeState("translating", "translated", {
      content,
      title,
    });
  }
  static novel() {
    return this.hasOne(Novel);
  }
  public async reset() {
    if (["fetched", "translated", "error"].includes(this.state as string)) {
      await this.changeState(this.state as State, "unfetch");
    }
  }
  public async oneShot() {
    try {
      if (this.state == "unfetch") await this.fetch();
      if (this.state == "fetched") await this.translate();
    } catch (e) {
      this.setErrorState(this.state as State, e as Error);
    }
  }
  private async changeState(oldState: State, newState: State, values?: Values) {
    if (oldState !== this.state) throw new Error("state mismatch");
    for (const key in values) this[key] = values[key];

    await Article.where("id", this.id as FieldValue).where("state", oldState)
      .update({ state: newState, ...values });
    Object.assign(this, values);
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
  public static async resetInProgress() {
    await Article.where("state", "fetching").update({ state: "unfetch" });
    await Article.where("state", "translating").update({ state: "fetched" });
  }
}
