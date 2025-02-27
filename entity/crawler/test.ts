import { assert } from "$std/assert/assert.ts";
import { ArticleSource, NovelSource } from "./mod.ts";
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

interface NovelTesterOption {
  name: string;
  novelUrl: string;
  title: string;
  description: string;
  author: string;
  ignore?: boolean;
  source: NovelSource;
}

// FIXME: check url
class NovelTester {
  option: NovelTesterOption;
  constructor(opt: NovelTesterOption) {
    this.option = opt;
  }
  test() {
    Deno.test(
      { name: this.option.name, ignore: this.option.ignore },
      async () => {
        const novel = await this.option.source.get_novel(this.option.novelUrl);

        assert(novel !== undefined, "novel not found");
        assert(
          novel?.name.trim().startsWith(this.option.title),
          "title not match",
        );
        assert(
          novel?.description.trim().startsWith(this.option.description),
          "description not match",
        );
        assert(
          novel?.author.trim().startsWith(this.option.author),
          "author not match",
        );
      },
    );
  }
}

interface ArticleTesterOption {
  name: string;
  articleUrl: string;
  title: string;
  content: string;
  ignore?: boolean;
  source: ArticleSource;
}

class ArticleTester {
  option: ArticleTesterOption;
  constructor(opt: ArticleTesterOption) {
    this.option = opt;
  }
  test() {
    Deno.test(
      { name: this.option.name, ignore: this.option.ignore },
      async () => {
        const article = await this.option.source.getArticle({
          title: this.option.title,
          url: this.option.articleUrl,
          index: 0,
        });
        assert(article !== undefined, "article not found");
        assert(
          article?.content.trim().startsWith(this.option.content),
          "content not match",
        );
        assert(
          article?.title.trim().startsWith(this.option.title),
          "title not match",
        );
      },
    );
  }
}

new NovelTester({
  name: "AlphapolisNovel",
  novelUrl: "https://www.alphapolis.co.jp/novel/323153161/134250089",
  title:
    "異世界転移したら女神の化身にされてしまったので、世界を回って伝説を残します",
  author: "高崎三吉",
  description: "その乙女の名はアルタシャ。",
  source: new AlphapolisNovelSource(),
  ignore: true,
}).test();

new ArticleTester({
  name: "AlphapolisArticle",
  articleUrl:
    "https://www.alphapolis.co.jp/novel/323153161/134250089/episode/1666654",
  title: "第1話　繭から目覚めたら",
  content: "少年はまるで胎児のように",
  source: new AlphapolisArticleSource(),
  ignore: true,
}).test();

new NovelTester({
  name: "KakyomuNovel",
  novelUrl: "https://kakuyomu.jp/works/1177354054896166447",
  title: "レヴィア・クエスト！　～美少女パパと最強娘～",
  author: "ハートフル外道メーカーちりひと",
  description: "外道美少女の弱点は勇者？",
  source: new KakyomuNovelSource(),
}).test();

new ArticleTester({
  name: "KakyomuArticle",
  articleUrl:
    "https://kakuyomu.jp/works/1177354054896166447/episodes/1177354054896167527",
  title: "001. 美しき桃色の君",
  content: "――そこには、美があった。",
  source: new KakyomuArticleSource(),
}).test();

new NovelTester({
  name: "SyosetuNovel",
  novelUrl: "https://ncode.syosetu.com/n4404ew/",
  title: "終わりゆく世界に紡がれる魔導と剣の物語",
  author: "夏目 空桜",
  description: "これは幸せで、残酷な物語。",
  source: new SyosetuNovelSource(),
}).test();

new ArticleTester({
  name: "SyosetuArticle",
  articleUrl: "https://ncode.syosetu.com/n4404ew/2/",
  title: "TSヒロイン・初めまして異世界",
  content:
    "7／12＆7／13に投稿した『はじめました』『昨夜未明、俺は♀エルフになりました。』",
  source: new SyosetuArticleSource(),
}).test();

new NovelTester({
  name: "Syosetu18Novel",
  novelUrl: "https://novel18.syosetu.com/n5657gv/",
  title: "嫌われ勇者を演じた俺は、なぜかラスボスに好かれて一緒に生活してます！",
  author: "らいと",
  description: "※本作は連載を休止しております",
  source: new Syosetu18NovelSource(),
}).test();

new ArticleTester({
  name: "Syosetu18Article",
  articleUrl: "https://novel18.syosetu.com/n5657gv/3/",
  title: "元勇者パーティーに届く手紙◆",
  content: "勇者アレスがデミウルゴスとの戦闘を開始した頃と、ほぼ同時刻。",
  source: new Syosetu18ArticleSource(),
}).test();

new NovelTester({
  name: "hameln",
  novelUrl: "https://syosetu.org/novel/358899/",
  title: "境界剣士の最愛精霊《レスティアート》",
  author: "時杜　境",
  description: "かわいい最強精霊にハートキャッチ（物理）されて魂を焼",
  source: new hamelnNovelSource(),
}).test();

new ArticleTester({
  name: "hameln",
  articleUrl: "https://syosetu.org/novel/358899/2.html",
  title: "01　永遠契約 - 1",
  content: "「つかれた……」",
  source: new hamelnArticleSource(),
}).test();
