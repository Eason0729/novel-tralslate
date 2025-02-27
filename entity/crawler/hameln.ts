import { assert } from "$std/assert/assert.ts";
import { Language } from "../translater/mod.ts";
import * as def from "./mod.ts";
import { DOMParser, Element, HTMLDocument } from "jsr:@b-fuze/deno-dom";

const baseUrl = "https://syosetu.org/novel";

class ArticleMetaData implements def.ArticleMetaData {
  title: string;
  url: string;
  index: number;
  constructor(element: Element, index: number, novelUrl: string) {
    this.index = index;
    this.title = element.textContent as string;
    this.url = new URL(element.getAttribute("href") as string, novelUrl).href;
  }
}

export class ArticleSource implements def.ArticleSource {
  baseUrl = baseUrl;
  language: Language = "jp";
  async getArticle(
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
  content: string = "";
  constructor(dom: HTMLDocument, metadata: def.ArticleMetaData) {
    const contentElement = dom.querySelector("#honbun") as Element;
    for (const child of contentElement.children) {
      this.content += child.textContent + "\n";
    }
    this.content = this.content.trim();

    const closingElement = dom.querySelector("#atogaki");

    if (closingElement) {
      this.content += "------------\n";
      for (const child of closingElement.children) {
        this.content += child.textContent + "\n";
      }
    }

    this.title = metadata.title;
    this.url = metadata.url;
  }
}

export class NovelSource implements def.NovelSource {
  name = "ハーメルン";
  exampleUrl = "https://syosetu.org/novel/359725/";
  language: Language = "jp";
  canCreateUrl(url: string): boolean {
    return /https:\/\/syosetu.org\/novel\/\d+/.test(url);
  }
  async get_novel(url: string): Promise<Novel | undefined> {
    assert(this.canCreateUrl(url), "Invalid url");
    const rawHtml = await fetch(url).then((res) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");
    return new Novel(dom, url);
  }
}

export class Novel implements def.Novel {
  name;
  description: string;
  chapters: def.ArticleMetaData[] = [];
  author: string;
  constructor(domRoot: HTMLDocument, url: string) {
    this.name = domRoot.querySelector("span[itemprop=name]")
      ?.textContent as string;
    this.description = domRoot.querySelectorAll("div.ss")[1]
      ?.textContent as string;
    this.author = domRoot.querySelector(
      'a[href*="syosetu.org/user"]',
    )?.textContent as string;

    const articleElements = domRoot.querySelectorAll(
      "tr > td > a",
    );

    for (const articleElement of articleElements) {
      const article: ArticleMetaData = new ArticleMetaData(
        articleElement,
        this.chapters.length,
        url,
      );
      this.chapters.push(article);
    }
  }
}
