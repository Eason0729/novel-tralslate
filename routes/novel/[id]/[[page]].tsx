import { RouteContext } from "$fresh/server.ts";
import { Novel } from "../../../entity/novel.ts";
import { Article } from "../../../entity/article.ts";
import Error404 from "../../_404.tsx";
import Paragraph from "../../../components/Paragraph.tsx";
import ArticleList from "../../../components/novel/ArticleList.tsx";
import NovelInfo from "../../../components/novel/NovelInfo.tsx";
import NovelLoad from "../../../components/novel/NovelLoad.tsx";
import Alert from "../../../components/Alert.tsx";
import HomeButton from "../../../components/HomeButton.tsx";
import RandomBar from "../../../components/RandomBar.tsx";

export const initialSize = 50;
export const pageSize = 40;

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
    ).orderBy("index").limit(initialSize + pageNumber * pageSize)
    .all() as Article[];

  if (novel.state == "error") {
    return <Alert msg="This novel is in error state, please check the logs" />;
  }
  if (novel.state == "fetching") {
    return <Alert msg="This novel is being fetched, please wait" />;
  }
  return (
    <div class="container mx-auto m-2 p-6 max-w-4xl w-full dark:bg-slate-800 rounded-lg shadow-md">
      <NovelInfo novel={novel} />
      <ArticleList articles={articles} />
      {articles.length >= (initialSize + pageNumber * pageSize)
        ? <NovelLoad novelId={novelId} page={pageNumber} />
        : <RandomBar />}
      <HomeButton href="/" />
    </div>
  );
}
