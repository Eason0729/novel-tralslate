import { assert } from "$std/assert/assert.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import {
  Article as AlphapolisArticle,
  Novel as AlphapolisNovel,
  NovelSource as AlphapolisNovelSource,
} from "./alphapolis.ts";

Deno.test("AlphapolisNovelSource", () => {
  const source = new AlphapolisNovelSource();
  assert(source.name === "Alphapolis");
  assert(source.baseUrl === "https://www.alphapolis.co.jp");
});

Deno.test("AlphapolisNovel", async () => {
  const source = new AlphapolisNovelSource();
  const novel = await source.get_novel(
    "https://www.alphapolis.co.jp/novel/323153161/134250089",
  );
  assert(novel instanceof AlphapolisNovel);
  assertEquals(
    novel.name,
    "異世界転移したら女神の化身にされてしまったので、世界を回って伝説を残します",
  );
  assert(
    novel.description.trimStart().startsWith("その乙女の名はアルタシャ。"),
  );
  assert(novel.author === "高崎三吉");
  assert(novel.chapters.length > 0);
  assert(novel.chapters[0] instanceof AlphapolisArticle);
});

// Deno.test("AlphapolisArticle", async () => {
//   const article = new AlphapolisArticle(
//     {
//       querySelector: () => ({
//         textContent: "title",
//         getAttribute: () =>
//           "https://www.alphapolis.co.jp/novel/323153161/134250089/episode/1666654",
//       }),
//     } as any,
//     "referer",
//   );
//   const content = await article.get_content();
//   assert(content.trimStart().startsWith("少年はまるで胎児のように"));
// });
