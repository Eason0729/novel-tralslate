import * as Crawler from "./crawler/mod.ts";
import translate from "./translate.ts";

export class NovelCollection {
  novels: Map<string, Novel> = new Map();
  urls: Set<string> = new Set();
  async getNovel(url: string): Promise<Novel | undefined> {
    if (this.urls.has(url)) {
      return this.novels.get(url);
    }
    this.urls.add(url);

    const rawNovel = await Crawler.getNovel(url);
    if (rawNovel == undefined) return;
    this.novels.set(url, new Novel(rawNovel));
    return this.novels.get(url);
  }
}

export class Novel {
  raw: Crawler.Novel;
  articles: Article[] = [];
  constructor(raw: Crawler.Novel) {
    this.raw = raw;
    this.articles = raw.chapters.map((x) => new Article(x));
  }
  get name() {
    return this.raw.name;
  }
  get description() {
    return this.raw.description;
  }
  get author() {
    return this.raw.author;
  }
  preHeatArticle(index: number) {
    this.articles[index].getContent();
  }
  async getArticle(index: number) {
    if (index >= this.articles.length) return;
    await this.articles[index].getContent();
    return this.articles[index].content as string;
  }
}

type ArticleStatus =
  | "unfetch"
  | "fetching"
  | "translating"
  | "translated"
  | "error";

export class Article {
  status: ArticleStatus = "unfetch";
  raw: Crawler.Article;
  finishHook: ((content: string) => void)[] = [];
  content?: string;
  constructor(raw: Crawler.Article) {
    this.raw = raw;
  }
  get title() {
    return this.raw.title;
  }
  async getContent(): Promise<string> {
    if (this.status == "translated") return this.content as string;
    else if (this.status != "unfetch") {
      return new Promise<string>((resolve) => {
        this.finishHook.push((x) => {
          resolve(x);
        });
      });
    }

    this.status = "fetching";
    try {
      const content = await this.raw.get_content();
      this.status = "translating";
      this.content = await translate(content);
      this.status = "translated";
      this.finishHook.forEach((hook) => hook(this.content as string));
      return this.content;
    } catch (e) {
      this.status = "error";
      throw e;
    }
  }
}
