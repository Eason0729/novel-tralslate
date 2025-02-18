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
import NovelList from "../../../components/novel/NovelList.tsx";

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

  const [articles, novels] = await Promise.all([
    Article.where("novelId", id)
      .select(
        "id",
        "state",
        "index",
        "title",
        "untranslatedTitle",
      ).orderBy("index").limit(initialSize + pageNumber * pageSize)
      .all() as Promise<Article[]>,
    Novel.select("id", "name", "untranslatedName").orderBy("updatedAt", "desc")
      .where("hidden", false)
      .all() as Promise<Novel[]>,
  ]);

  if (novel.state == "error") {
    novel.reset().then(() => novel.oneShot());
    return (
      <ErrorPage
        code="500"
        message="Oops! It seems like we are unable to fetch/translate novel. Check log."
        redirectUrl={"/novel/" + novelId}
      />
    );
  }
  if (novel.state == "fetching") return <Loading />;

  return (
    <div class="grid grid-cols-3 xl:grid-cols-4 auto-rows-fr">
      <div class="col-span-1 hidden h-screen overflow-y-scroll rtl lg:block border-r border-gray-200 dark:border-gray-800">
        <div class="ltr">
          <NovelList novels={novels} />
        </div>
      </div>
      <div class="col-span-3 lg:col-span-2 xl:col-span-3 h-screen overflow-y-scroll flex justify-center gutter">
        <div class="p-8 max-w-4xl">
          <NovelInfo novel={novel} />
          <ArticleList articles={articles} />
          {articles.length >= (initialSize + pageNumber * pageSize)
            ? <NovelLoad novelId={novelId} page={pageNumber} />
            : <RandomBar />}
          <HomeButton href="/" />
          <Footer />
        </div>
      </div>
    </div>
  );
}
