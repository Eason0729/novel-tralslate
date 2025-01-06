import { RouteContext } from "$fresh/server.ts";
import { Article } from "../../../../entity/article.ts";
import Error404 from "../../../_404.tsx";
import NovelList from "../../../../components/novel/NovelList.tsx";
import NovelLoad from "../../../../components/novel/NovelLoad.tsx";
import { Partial } from "$fresh/runtime.ts";
import { initialSize, pageSize } from "../../../novel/[id]/[[page]].tsx";
import RandomBar from "../../../../components/RandomBar.tsx";

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const { id, page } = ctx.params as { id: string; page: string };
  const novelId = parseInt(id);
  const pageNumber = parseInt(page);

  if (isNaN(novelId) || isNaN(pageNumber)) return <Error404 />;

  const articles = await Article.where("novelId", id)
    .select(
      "id",
      "state",
      "index",
      "title",
    ).orderBy("index").offset(initialSize + pageNumber * pageSize - pageSize)
    .limit(pageSize).all() as Article[];

  return (
    <>
      <NovelList articles={articles} />
      {(articles.length < pageSize)
        ? (
          <Partial name="novel-load">
            <RandomBar />
          </Partial>
        )
        : <NovelLoad novelId={novelId} page={pageNumber} />}
    </>
  );
}
