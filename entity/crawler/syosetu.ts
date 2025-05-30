import { assert } from "$std/assert/assert.ts";
import { Language } from "../translater/mod.ts";
import * as def from "./mod.ts";
import { DOMParser, Element, HTMLDocument } from "jsr:@b-fuze/deno-dom";

const baseUrl = "https://ncode.syosetu.com";

class ArticleMetaData implements def.ArticleMetaData {
  title: string;
  url: string;
  index: number;
  constructor(element: Element, index: number) {
    this.index = index;
    this.title = element.textContent as string;
    this.url = new URL(element.getAttribute("href") as string, baseUrl).href;
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
  content: string;
  constructor(dom: HTMLDocument, metadata: def.ArticleMetaData) {
    this.content = dom.querySelector(".p-novel__body")
      ?.textContent as string;
    this.title = metadata.title;
    this.url = metadata.url;
  }
}

export class NovelSource implements def.NovelSource {
  name = "小説家になろう";
  exampleUrl = "https://ncode.syosetu.com/n0831jx/";
  language: Language = "jp";
  canCreateUrl(url: string): boolean {
    return /https:\/\/ncode.syosetu.com\/n\d+\w+/.test(url);
  }
  async get_novel(url: string): Promise<Novel | undefined> {
    assert(this.canCreateUrl(url), "Invalid url");
    const rawHtml = await fetch(url).then((
      res,
    ) => res.text());
    const doms = [new DOMParser().parseFromString(rawHtml, "text/html")];

    let nextUrl = doms[doms.length - 1].querySelector("a.c-pager__item--next");
    while (nextUrl) {
      const rebasedNextUrl = new URL(
        nextUrl.getAttribute("href") as string,
        url,
      );
      const rawHtml = await fetch(rebasedNextUrl).then((
        res,
      ) => res.text());
      const dom = new DOMParser().parseFromString(rawHtml, "text/html");
      nextUrl = dom.querySelector("a.c-pager__item--next");
      doms.push(dom);
    }
    return new Novel(doms);
  }
}

export class Novel implements def.Novel {
  name;
  description: string;
  chapters: def.ArticleMetaData[] = [];
  author: string;
  constructor(domRoots: HTMLDocument[]) {
    this.name = domRoots[0].querySelector("h1.p-novel__title")
      ?.textContent as string;
    this.description = domRoots[0].querySelector("#novel_ex")
      ?.textContent as string;
    this.author = domRoots[0].querySelector(
      "div.p-novel__author > a",
    )?.textContent as string;

    domRoots.map((domRoot) => {
      const articleElements = domRoot.querySelectorAll(
        "div.p-eplist__sublist > a",
      );

      for (const articleElement of articleElements) {
        const article: ArticleMetaData = new ArticleMetaData(
          articleElement,
          this.chapters.length,
        );
        this.chapters.push(article);
      }
    });
  }
}
