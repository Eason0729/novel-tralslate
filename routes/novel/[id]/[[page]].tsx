import { RouteContext } from "$fresh/server.ts";
import { Novel } from "../../../entity/novel.ts";
import { Article } from "../../../entity/article.ts";
import Error404 from "../../_404.tsx";
import ArticleList from "../../../components/novel/ArticleList.tsx";
import NovelInfo from "../../../components/novel/NovelInfo.tsx";
import NovelLoad from "../../../components/novel/NovelLoad.tsx";
import HomeButton from "../../../components/HomeButton.tsx";
import RandomBar from "../../../components/RandomBar.tsx";
import Footer from "../../../components/Footer.tsx";
import ErrorPage from "../../../components/ErrorPage.tsx";
import Loading from "../../../components/Loading.tsx";

export const initialSize = 60;
export const pageSize = 45;

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const { id, page } = ctx.params as { id: string; page?: string };
  const novelId = parseInt(id);
  const pageNumber = parseInt(page || "0");

  if (isNaN(novelId) || isNaN(pageNumber)) return <Error404 />;

  const novel = await Novel.getById(novelId);
  if (!novel) return <Error404 />;

  novel.oneShot();

  const articles = await Article.where("novelId", id)
    .select(
      "id",
      "state",
      "index",
      "title",
      "untranslatedTitle",
    ).orderBy("index").limit(initialSize + pageNumber * pageSize)
    .all() as Article[];

  if (novel.state == "error") {
    return (
      <ErrorPage
        code="500"
        message="Oops! It seems like we are unable to translate novel. Check log."
        redirectUrl={"/novel/" + novelId}
      />
    );
  }
  if (novel.state == "fetching") return <Loading />;

  return (
    <div class="container mx-auto m-2 p-6 max-w-4xl w-full dark:bg-slate-800 rounded-lg shadow-md">
      <NovelInfo novel={novel} />
      <ArticleList articles={articles} />
      {articles.length >= (initialSize + pageNumber * pageSize)
        ? <NovelLoad novelId={novelId} page={pageNumber} />
        : <RandomBar />}
      <HomeButton href="/" />
      <Footer />
    </div>
  );
}
