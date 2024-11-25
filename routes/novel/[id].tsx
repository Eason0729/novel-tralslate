import { RouteContext } from "$fresh/server.ts";
import { StartButton } from "../../islands/StartButton.tsx";
import { Novel } from "../../entity/novel.ts";
import { Article, State as ArticleState } from "../../entity/article.ts";
import Error404 from "../_404.tsx";
import Paragraph from "../../components/Paragraph.tsx";
/**
 * Check if the title includes the index, such as "第1話" for index 0.
 * @param title
 * @param index
 * @returns
 */
function checkTitleIndex(title: string, index: number): boolean {
  return title.includes((index + 1).toString());
}

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const novelId = parseInt(id);

  if (isNaN(novelId)) return <Error404 />;

  const novel = await Novel.getById(novelId);
  if (!novel) return <Error404 />;
  const list = [];

  novel.oneShot();

  for (
    const article of await Article.where("novelId", id).select(
      "id",
      "state",
      "index",
      "title",
    ).orderBy("index").all() as Article[]
  ) {
    let state;
    switch (article.state as ArticleState) {
      case "unfetch":
        state = "start";
        break;
      case "translating":
      case "fetching":
        state = "running";
        break;
      default:
        state = "retry";
    }
    const title = article.title as string;
    const index = article.index as number;
    list.push(
      <div class="flex justify-between items-center font-semibold tracking-tight text-2xl mb-2">
        <a
          href={"/article/" + article.id}
          class="whitespace-nowrap overflow-x-hidden mr-3"
        >
          {checkTitleIndex(title, index) ? title : `第${index + 1}話 ${title}`}
        </a>
        <StartButton
          url={"/api/retry/" + article.id}
          current={state}
        />
      </div>,
    );
  }

  const description =
    (novel.state == "translated"
      ? novel.description
      : novel.untranslatedDescription) as string;

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="text-center">
        {novel.state == "unfetch" || novel.state == "fetching"
          ? (
            <div class="animate-pulse">
              <div class="h-4 my-6 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          )
          : <h1 class="text-4xl font-bold mb-4">{novel.name}</h1>}
      </div>
      <Paragraph content={description} />
      <div class="mt-9 rounded-lg border shadow-sm overflow-hidden p-6 space-y-8">
        {list}
      </div>
    </div>
  );
}
