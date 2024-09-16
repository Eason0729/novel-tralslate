import { assert } from "$std/assert/assert.ts";
import * as def from "./mod.ts";
import { defaultHeaders } from "./fetch.ts";
import { DOMParser, Element, HTMLDocument } from "jsr:@b-fuze/deno-dom";

class ArticleMetaData implements def.ArticleMetaData {
  title: string;
  url: string;
  index: number;
  constructor(element: Element, index: number) {
    this.index = index;
    this.title = element.querySelector("span.title")?.textContent as string;
    this.url = element.querySelector("a")?.getAttribute("href") as string;
  }
}

export class ArticleSource implements def.ArticleSource {
  name = "Alphapolis";
  baseUrl = "https://www.alphapolis.co.jp";
  async get_article(
    metadata: def.ArticleMetaData,
  ): Promise<Article | undefined> {
    const rawHtml = await fetch(metadata.url, {
      headers: {
        ...defaultHeaders,
      },
    }).then((res) => res.text());
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
    this.content = dom.querySelector("div.text#novelBody")
      ?.textContent as string;
    this.title = metadata.title;
    this.url = metadata.url;
  }
  async get_content() {
    const rawHtml = await fetch(this.url, {
      headers: {
        ...defaultHeaders,
      },
    }).then((res) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");
    return dom.querySelector("div.text#novelBody")?.textContent as string;
  }
}

export class NovelSource implements def.NovelSource {
  name = "Alphapolis";
  baseUrl = "https://www.alphapolis.co.jp";
  async get_novel(url: string): Promise<Novel | undefined> {
    assert(url.startsWith(this.baseUrl), "Invalid url");
    const rawHtml = await fetch(url, {
      headers: {
        Referer: "https://www.google.com/search?q=alphapolis",
        ...defaultHeaders,
      },
    }).then((
      res,
    ) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");
    return new Novel(dom);
  }
}

export class Novel implements def.Novel {
  name;
  description: string;
  chapters: def.ArticleMetaData[] = [];
  author: string;
  constructor(domRoot: HTMLDocument) {
    this.name = domRoot.querySelector("h1.title")?.textContent as string;
    this.description = domRoot.querySelector("div.abstract:nth-child(3)")
      ?.textContent as string;
    this.author = domRoot.querySelector(
      ".author > span:nth-child(1) > a:nth-child(1)",
    )?.textContent as string;

    const articleElements = domRoot.querySelectorAll(
      "div.episodes > div.episode",
    );

    let index = 0;
    for (const articleElement of articleElements) {
      const article = new ArticleMetaData(articleElement, index++);
      this.chapters.push(article);
    }
  }
}
