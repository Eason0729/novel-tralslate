import { assert } from "$std/assert/assert.ts";
import * as def from "./mod.ts";
import { DOMParser, HTMLDocument } from "jsr:@b-fuze/deno-dom";

class ArticleMetaData implements def.ArticleMetaData {
  title: string;
  url: string;
  index: number;
  constructor(title: string, id: string, baseUrl: string, index: number) {
    this.title = title;
    this.index = index;
    this.url = `${baseUrl}/episodes/${id}`;
  }
  static fromJSON(json: any, baseUrl: string): ArticleMetaData[] {
    const result: {
      id: string;
      title: string;
      publishedAt: Date;
    }[] = [];

    const episodeData = json["props"]["pageProps"]["__APOLLO_STATE__"];
    for (const key in episodeData) {
      if (!key.startsWith("Episode:")) continue;
      const publishedAtRaw = episodeData[key]["publishedAt"] as string;
      const publishedAt = new Date(
        publishedAtRaw.replaceAll("T", "").replaceAll("Z", ""),
      );
      result.push({
        id: episodeData[key]["id"],
        title: episodeData[key]["title"],
        publishedAt,
      });
    }
    result.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());

    return result.map((episode, index) =>
      new ArticleMetaData(episode.title, episode.id, baseUrl, index)
    );
  }
}

export class ArticleSource implements def.ArticleSource {
  baseUrl = "https://kakuyomu.jp/works";
  async get_article(
    metadata: def.ArticleMetaData,
  ): Promise<Article | undefined> {
    const rawHtml = await fetch(metadata.url).then((res) => res.text());
    return new Article(
      new DOMParser().parseFromString(rawHtml, "text/html"),
      metadata,
    );
  }
}

export class Article implements def.Article {
  title: string;
  url: string;
  content: string;
  constructor(dom: HTMLDocument, metadata: def.ArticleMetaData) {
    this.content = dom.querySelector(".widget-episode-inner")
      ?.textContent as string;
    this.title = metadata.title;
    this.url = metadata.url;
  }
}

export class NovelSource implements def.NovelSource {
  name = "カクヨム";
  baseUrl = "https://kakuyomu.jp/works";
  async get_novel(url: string): Promise<Novel | undefined> {
    assert(url.startsWith(this.baseUrl), "Invalid url");
    const rawHtml = await fetch(url).then((
      res,
    ) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");
    return new Novel(dom, url);
  }
}

export class Novel implements def.Novel {
  name;
  description: string;
  chapters: def.ArticleMetaData[] = [];
  author: string;
  constructor(domRoot: HTMLDocument, baseUrl: string) {
    this.name = domRoot.querySelector('h1[class*="Heading_heading__"]')
      ?.textContent as string;
    this.author = domRoot.querySelector(
      'div[class*="Typography_lineHeight"] > .partialGiftWidgetActivityName',
    )?.textContent as string;
    this.description = domRoot.querySelector(
      'div:not([class]) > div[class*="NewBox"] > div[class*="NewBox"] > div[class*="Gap_size"]',
    )?.textContent as string;

    const bodyData = JSON.parse(
      domRoot.querySelector("#__NEXT_DATA__")?.innerHTML as string,
    );
    this.chapters = ArticleMetaData.fromJSON(bodyData, baseUrl);
  }
}
