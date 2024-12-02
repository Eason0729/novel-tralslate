import { Partial } from "$fresh/runtime.ts";
import { RouteContext } from "$fresh/server.ts";
import { Article } from "../../entity/article.ts";
import { Novel } from "../../entity/novel.ts";
import HomeButton from "../../components/HomeButton.tsx";
import Error404 from "../_404.tsx";
import TitleBar from "../../components/reader/TitleBar.tsx";
import TextView from "../../components/reader/TextView.tsx";
import Footer from "../../components/reader/Footer.tsx";

export default async function ArticlePage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const articleId = parseInt(id);

  if (isNaN(articleId)) return <Error404 />;

  const article = await Article.getById(articleId);
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

  const nextUrl = nextArticle.length == 0
    ? undefined
    : "/article/" + nextArticle[0].id;
  const previousUrl = previousArticle.length == 0
    ? undefined
    : "/article/" + previousArticle[0].id;

  const content =
    (article.content == ""
      ? article.untranslatedContent
      : article.content) as string;

  return (
    <div>
      <div class="flex flex-col h-screen w-full sm:max-w-2xl mx-auto">
        <Partial name="article-reader">
          <TitleBar title={novel.name as string} href={"/novel/" + novelId} />
          <TextView content={content}>
            {(article.title as string).trim()}
          </TextView>
          <Footer nextUrl={nextUrl} previousUrl={previousUrl} />
        </Partial>
      </div>
      <HomeButton />
    </div>
  );
}
