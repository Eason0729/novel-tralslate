import { assert } from "$std/assert/assert.ts";
import { Semaphore } from "semaphore";
import * as def from "./mod.ts";
import { DOMParser, Element, HTMLDocument } from "jsr:@b-fuze/deno-dom";

const parallel = new Semaphore(2);

async function fetchWAF(url: string) {
  const release = await parallel.acquire();
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
      "Cookie": Deno.env.get("WAF_COOKIES") ||
        "aws-waf-token=19d8adf6-5edd-4a91-a816-9a31c4c7e4ab:AQoAlLtBRBZmAAAA:evpYYXCS+jhRXLMx73H+mJu9r1UJ326ILHrrBEr6A+0mJL1js2+8AyWjJjQBJaYknNTX2Upe6uxJUyoG4QlbuM1N9rRlYg6GFH2kqI15bL+zrgSEqCzjE3M4nX+Cpsvv/T5JPl/OGHNNHxDnD7OAdMtCXDGB7lK8tQ8tkOiZHQagYuKlUgl9NaTopi+IacqWkHnzgnfarohwTMvkeMwKEhja2tz3xtZMf6bLLw6jrJMIv6VUXkXoYLYclHd0RJ0=; AWSALB=f7rqO8uhxInwQp3Ceu6Jf/2EOZU03J01oe4MG8SmwtzP+XiWLLDvtrm4591sxUYBQuNS2+lYQdBTwSUCGpSm1AVHLVyatC60NflncS45tU1IQV+xUXvJzlzTVGOy; AWSALBCORS=f7rqO8uhxInwQp3Ceu6Jf/2EOZU03J01oe4MG8SmwtzP+XiWLLDvtrm4591sxUYBQuNS2+lYQdBTwSUCGpSm1AVHLVyatC60NflncS45tU1IQV+xUXvJzlzTVGOy; XSRF-TOKEN=eyJpdiI6Im55bTJxZzdoSFhqcnc5clYrNVc2SlE9PSIsInZhbHVlIjoiN0tvNlAyYVFhK2ZtbTUyNkI5eXBsNUZzNlNKV3ZHTjFSeVBQamJqbnJBRXVnVmYvZ0c2RTN0TlRMNStYSWRzYitubEs0bVNlRVR0SGVZVEhndEx1ellGemRDd2tXVzVLNnhLdml1eFZoTnZ3Y0NUZU1INUgzekpyM0lRb3RsZ04iLCJtYWMiOiI2MTE5NzQ1YTU1ZjY2Y2Q4M2UyNDJjYjIxZmVkMDMzZWRkMTJmMmRhNmE2ODhmZWFhMGFkOTE3OTMzZGUyMTZjIiwidGFnIjoiIn0%3D; alpl_v2_front_session=eyJpdiI6ImRIK044T09XaVpvVFJRSlJtMEFyVXc9PSIsInZhbHVlIjoiaXVzUlkxUnZiQ1M4cisxSHVtNnlBMWU1R2IyOFhxZDh1ejVXMWpUQ3ptay9IK0ZzQ1FQcmpGR0Ryb2dwRytGT29Nc2x5NlBkb1VweTloUTN5YkoyR2xuRE5xWWdCNWw1Q0prNmN1TEk2NGFhRmZJZVJvbm9GYTdzc0Y2RjViQ20iLCJtYWMiOiIwYmQzYjZkM2M3MTg1MGNlOGUxOTNlNjJkYzg2ZTY5YjI5Yzk2M2YyYTQ3ZDc0OWUyZWIzNWFlMGFiY2RiOGQxIiwidGFnIjoiIn0%3D; device_uuid=eyJpdiI6ImI5aUIwb1k2S1d0TzMya0lSRnhySEE9PSIsInZhbHVlIjoiZDRVSmZKVktTZVkvcnFFZTVwNmdUQUdlM1NyQU14NjJpWXpnQUtaQjlQL0RXb2ROaUJOa1pnV1ZXR3lOajh5bG5nUlFJbDEwWWxjazFyYjBKT2pJMERCTllXcHg4a040RWdZakFSWEs2Slk9IiwibWFjIjoiMmY0ZDcyZTk4YTZkNTAyMmVhMjM2MmIyY2IyOTAxNmNlNTI4YzIzNTIyY2RiNDBmZGQ1M2I0ZDFkMDQzMGY1ZSIsInRhZyI6IiJ9; _pubcid=9acbf7e7-8d37-4134-a12a-1ad1247b0a0e; _pubcid_cst=zix7LPQsHA%3D%3D; a2cv2=eyJpdiI6Im9YcEVEUjgzSlhZdlozYzAwWU9DOEE9PSIsInZhbHVlIjoiZFk1WDE3VlRmcElVdUszbGZ2LzM3b041c2xYQ01vdDJQQWM2VnczNjNIOWV3WkxadG5WSXhTT21zWlltczlVZkh4Rkt5Mkx1MzFQNkxDWndCVWs5bHlwbGdlMTVzOE5Ndm8rL2hZVHJqdFE9IiwibWFjIjoiNDc3MDgyYzUzZjEyYTZjYTQ5ZmRlMjMzZWEwNTFlNzA2OGU3Njk3Njk5MTgwMmVhMzEzZTgzZGFkZjI5OWIyOSIsInRhZyI6IiJ9",
    },
  });
  setTimeout(release, 10000 + Math.random() * 10000);
  return res;
}

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
  baseUrl = "https://www.alphapolis.co.jp";
  async get_article(
    metadata: def.ArticleMetaData,
  ): Promise<Article | undefined> {
    const rawHtml = await fetchWAF(metadata.url).then((res) => res.text());
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
}

export class NovelSource implements def.NovelSource {
  name = "アルファポリス";
  baseUrl = "https://www.alphapolis.co.jp";
  async get_novel(url: string): Promise<Novel | undefined> {
    assert(url.startsWith(this.baseUrl), "Invalid url");
    const rawHtml = await fetchWAF(url).then((
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
