import { RouteContext } from "$fresh/server.ts";
import { Article } from "../../entity/article.ts";
import { Novel } from "../../entity/novel.ts";
import HomeButton from "../../components/HomeButton.tsx";
import Error404 from "../_404.tsx";
import TitleBar from "../../components/reader/TitleBar.tsx";
import TextView from "../../components/reader/TextView.tsx";
import Footer from "../../components/reader/Footer.tsx";
import Loading from "../../components/Loading.tsx";

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
    Novel.select("name", "untranslatedName").getById(novelId) as Promise<Novel>,
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
  if (nextArticle.length > 0) {
    const article = nextArticle[0] as Article;
    article.upgrade().then(() => article.oneShot());
  }

  const previousUrl = previousArticle.length == 0
    ? undefined
    : "/article/" + previousArticle[0].id;

  const content =
    (article.content == ""
      ? article.untranslatedContent
      : article.content) as string;

  if (content == "") return <Loading />;

  return (
    <div>
      <div class="flex flex-col h-screen w-full sm:max-w-2xl mx-auto">
        <TitleBar
          title={novel.name as string || novel.untranslatedName as string}
        />
        <TextView content={content}>
          {(article.title as string).trim()}
        </TextView>
        <Footer nextUrl={nextUrl} previousUrl={previousUrl} />
      </div>
      <HomeButton href={"/novel/" + novelId} />
    </div>
  );
}
