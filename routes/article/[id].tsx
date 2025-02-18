import { RouteContext } from "$fresh/server.ts";
import { Article } from "../../entity/article.ts";
import { Novel } from "../../entity/novel.ts";
import HomeButton from "../../components/HomeButton.tsx";
import Error404 from "../_404.tsx";
import TitleBar from "../../components/reader/TitleBar.tsx";
import TextView from "../../components/reader/TextView.tsx";
import Footer from "../../components/reader/Footer.tsx";
import Loading from "../../components/Loading.tsx";
import { Head } from "$fresh/runtime.ts";

async function getNearestArticle(
  index: number,
  novelId: number,
): Promise<[Article | undefined, Article | undefined]> {
  const [previousArticles, nextArticle] = await Promise.all([
    Article.select("id", "state").where("novelId", novelId).where(
      "index",
      index - 1,
    ).all(),
    Article.select("id", "state").where("novelId", novelId).where(
      "index",
      index + 1,
    ).all(),
  ]);
  return [
    previousArticles[0] as Article | undefined,
    nextArticle[0] as Article | undefined,
  ];
}

export default async function ArticlePage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const articleId = parseInt(id);

  if (isNaN(articleId)) return <Error404 />;

  const article = await Article.getById(articleId);
  if (!article) return <Error404 />;

  article.oneShot();

  const index = article.index as number;
  const novelId = article.novelId as number;

  const [novel, [previousArticle, nextArticle]] = await Promise.all([
    Novel.select("name", "untranslatedName").getById(novelId) as Promise<Novel>,
    getNearestArticle(index, novelId),
  ]);

  if (nextArticle) nextArticle.upgrade().then(() => article.oneShot());

  const content =
    (article.content == ""
      ? article.untranslatedContent
      : article.content) as string;

  if (content == "") return <Loading />;

  return (
    <main>
      <Head>
        <title>{(article.title as string).trim()}</title>
      </Head>
      <HomeButton href={"/novel/" + novelId} />

      <div class="flex flex-col h-screen w-full sm:max-w-2xl xl:max-w-[60vw] mx-auto">
        <TitleBar
          title={novel.name as string || novel.untranslatedName as string}
        />
        <TextView content={content}>
          {(article.title as string).trim()}
        </TextView>
        <Footer
          nextUrl={nextArticle ? "/article/" + nextArticle.id : undefined}
          previousUrl={previousArticle
            ? "/article/" + previousArticle.id
            : undefined}
        />
      </div>
    </main>
  );
}
