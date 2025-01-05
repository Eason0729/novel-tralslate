import {
  ArticleSource as AlphapolisArticleSource,
  NovelSource as AlphapolisNovelSource,
} from "./alphapolis.ts";
import {
  ArticleSource as KakyomuArticleSource,
  NovelSource as KakyomuNovelSource,
} from "./kakuyomu.ts";
import {
  ArticleSource as SyosetuArticleSource,
  NovelSource as SyosetuNovelSource,
} from "./syosetu.ts";
import {
  ArticleSource as Syosetu18ArticleSource,
  NovelSource as Syosetu18NovelSource,
} from "./syosetu18.ts";
import {
  ArticleSource as hamelnArticleSource,
  NovelSource as hamelnNovelSource,
} from "./hameln.ts";

/**
 * Source website for novel
 */
export interface NovelSource {
  /**
   * Name of the source
   */
  name: string;
  /**
   * Base url of the source
   */
  baseUrl: string;
  /**
   * Disable the source
   */
  disable?: boolean;
  /**
   * Get novel info
   * @param url Novel url
   */
  get_novel(url: string): Promise<Novel | undefined>;
}

/**
 * Novel with prefetch article ids
 */
export interface Novel {
  name: string;
  description: string;
  author: string;
  chapters: ArticleMetaData[];
}

export interface ArticleSource {
  /**
   * base url of the source
   */
  baseUrl: string;
  /**
   * Disable the source
   */
  disable?: boolean;
  /*
   * Get article content
   * @param url Article url
   */
  get_article(url: ArticleMetaData): Promise<Article | undefined>;
}

export interface Article {
  title: string;
  url: string;
  content: string;
}

export interface ArticleMetaData {
  title: string;
  url: string;
  index: number;
}

const sources = ([
  new AlphapolisNovelSource(),
  new KakyomuNovelSource(),
  new SyosetuNovelSource(),
  new Syosetu18NovelSource(),
  new hamelnNovelSource(),
] as NovelSource[]).filter((source) => !source.disable);

export function getNovel(url: string): Promise<Novel | undefined> {
  for (const source of sources) {
    if (url.startsWith(source.baseUrl)) {
      return source.get_novel(url);
    }
  }
  return Promise.resolve(undefined);
}

const articleSources = ([
  new AlphapolisArticleSource(),
  new KakyomuArticleSource(),
  new SyosetuArticleSource(),
  new Syosetu18ArticleSource(),
  new hamelnArticleSource(),
] as ArticleSource[]).filter((source) => !source.disable);

export function getArticle(
  metadata: ArticleMetaData,
): Promise<Article | undefined> {
  for (const source of articleSources) {
    if (metadata.url.startsWith(source.baseUrl)) {
      return source.get_article(metadata);
    }
  }
  return Promise.resolve(undefined);
}

export function getSupportedSources(): { name: string; baseUrl: string }[] {
  return sources.map((source) => ({
    name: source.name,
    baseUrl: source.baseUrl,
  }));
}

export function isUrlSupported(url: string): boolean {
  return sources.some((source) => url.startsWith(source.baseUrl));
}
