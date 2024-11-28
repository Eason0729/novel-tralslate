import { RouteContext } from "$fresh/server.ts";
import { Novel } from "../../entity/novel.ts";
import { Article } from "../../entity/article.ts";
import Error404 from "../_404.tsx";
import Paragraph from "../../components/Paragraph.tsx";
import NovelList from "../../components/novel/NovelList.tsx";
import NovelInfo from "../../components/novel/NovelInfo.tsx";

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const novelId = parseInt(id);

  if (isNaN(novelId)) return <Error404 />;

  const novel = await Novel.getById(novelId);
  if (!novel) return <Error404 />;

  novel.oneShot();

  const articles = await Article.where("novelId", id)
    .select(
      "id",
      "state",
      "index",
      "title",
    ).orderBy("index").all() as Article[];

  const description =
    (novel.state == "translated"
      ? novel.description
      : novel.untranslatedDescription) as string;

  return (
    <div class="container mx-auto m-2 p-6 max-w-4xl w-full dark:bg-slate-800 rounded-lg shadow-md">
      <NovelInfo novel={novel} />
      <Paragraph content={description} />
      <NovelList articles={articles} />
    </div>
  );
}
