import { AlphapolisNovelSource } from "./alphapolis.ts";

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
   * Get novel info
   * @param url Novel url
   */
  get_novel(url: string): Promise<Novel | undefined>;
}

/**
 * Article without content
 */
export interface Article {
  title: string;
  get_content(): Promise<string>;
}

/**
 * Novel with prefetch article ids
 */
export interface Novel {
  name: string;
  description: string;
  author: string;
  chapters: Article[];
}

const sources: NovelSource[] = [new AlphapolisNovelSource()];
export function getNovel(url: string): Promise<Novel | undefined> {
  for (const source of sources) {
    if (url.startsWith(source.baseUrl)) {
      return source.get_novel(url);
    }
  }
  return Promise.resolve(undefined);
}
