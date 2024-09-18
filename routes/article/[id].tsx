import { RouteContext } from "$fresh/server.ts";
import { Article } from "../../entity/article.ts";
import { Novel } from "../../entity/novel.ts";
import HomeButton from "../../components/HomeButton.tsx";
import Error404 from "../_404.tsx";
import Paragraph from "../../components/Paragraph.tsx";
import ArrowButton from "../../components/ArrowButton.tsx";

export default async function ArticlePage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const article = await Article.getById(parseInt(id));
  if (!article) return <Error404 />;

  article.oneShot();

  const index = article.index as number;
  const novelId = article.novelId as number;

  const [novel, previousArticle, nextArticle] = await Promise.all([
    Novel.select("name").getById(novelId) as Promise<Novel>,
    Article.select("id").where("novelId", novelId).where(
      "index",
      index - 1,
    ).all(),
    Article.select("id").where("novelId", novelId).where(
      "index",
      index + 1,
    ).all(),
  ]);

  const content =
    (article.content == ""
      ? article.untranslatedContent
      : article.content) as string;

  return (
    <div>
      <div class="flex flex-col h-screen w-full sm:max-w-2xl mx-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h1 class="text-3xl font-bold overflow-hidden whitespace-nowrap mr-3">
            {novel.name}
          </h1>
          <a
            class="dark:bg-slate-300 dark:text-black inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border py-1 px-2 h-12 w-12"
            type="button"
            href={"/novel/" + article.novelId}
            aria-label="Back to novel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </a>
        </div>
        <div class="flex-grow overflow-auto p-6">
          <h2 class="text-2xl font-semibold mb-4">
            {(article.title as string).includes((index + 1).toString())
              ? undefined
              : `第${index + 1}話 `}
            {article.title}
          </h2>
          <div class="pb-10">
            <Paragraph content={content} />
          </div>
        </div>
        <footer class="flex justify-between p-4 border-t">
          <a
            href={previousArticle.length == 0
              ? "#"
              : ("/article/" + previousArticle[0].id)}
          >
            <ArrowButton
              disabled={previousArticle.length == 0}
              direction="left"
            />
          </a>

          {nextArticle.length > 0
            ? (
              <a href={"/article/" + nextArticle[0].id}>
                <ArrowButton direction="right" />
              </a>
            )
            : undefined}
        </footer>
      </div>
      <HomeButton />
    </div>
  );
}
