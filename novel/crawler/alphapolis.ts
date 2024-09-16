import { assert } from "$std/assert/assert.ts";
import { Article, Novel, NovelSource } from "./mod.ts";
import { defaultHeaders } from "./fetch.ts";
import { DOMParser, Element, HTMLDocument } from "jsr:@b-fuze/deno-dom";

export class AlphapolisNovelSource implements NovelSource {
  name = "Alphapolis";
  baseUrl = "https://www.alphapolis.co.jp";
  async get_novel(url: string): Promise<AlphapolisNovel | undefined> {
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
    return new AlphapolisNovel(dom, url);
  }
}

export class AlphapolisNovel implements Novel {
  name = "";
  description: string;
  chapters: AlphapolisArticle[] = [];
  author: string;
  constructor(domRoot: HTMLDocument, baseUrl: string) {
    this.name = domRoot.querySelector("h1.title")?.textContent as string;
    this.description = domRoot.querySelector("div.abstract:nth-child(3)")
      ?.textContent as string;
    this.author = domRoot.querySelector(
      ".author > span:nth-child(1) > a:nth-child(1)",
    )?.textContent as string;

    const articleElements = domRoot.querySelectorAll(
      "div.episodes > div.episode",
    );

    for (const articleElement of articleElements) {
      const article = new AlphapolisArticle(articleElement, baseUrl);
      this.chapters.push(article);
    }
  }
}

export class AlphapolisArticle implements Article {
  title: string;
  url: string;
  referer: string;
  constructor(element: Element, referer: string) {
    this.title = element.querySelector("span.title")?.textContent as string;
    this.url = element.querySelector("a")?.getAttribute("href") as string;
    this.referer = referer;
  }
  async get_content() {
    const rawHtml = await fetch(this.url, {
      headers: {
        Referer: this.referer,
        ...defaultHeaders,
      },
    }).then((res) => res.text());
    const dom = new DOMParser().parseFromString(rawHtml, "text/html");
    return dom.querySelector("div.text#novelBody")?.textContent as string;
  }
}
