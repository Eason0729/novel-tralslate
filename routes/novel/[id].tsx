import { RouteContext } from "$fresh/server.ts";
import { StartButton } from "../../islands/StartButton.tsx";
import { Novel } from "../../entity/novel.ts";
import { Article, State as ArticleState } from "../../entity/article.ts";

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const { id } = ctx.params as { id: string };
  const novel = await Novel.getById(parseInt(id));
  const list = [];

  novel.oneShot();

  for (const article of await Novel.where("id", id).articles() as Article[]) {
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
    list.push(
      <div class="flex justify-between items-center font-semibold tracking-tight text-2xl mb-2">
        <a
          href={"/article/" + article.id}
          class="whitespace-nowrap overflow-x-hidden mr-3"
        >
          Web {article.index as number + 1} {article.title}
        </a>
        <StartButton
          url={"/api/retry/" + article.id}
          current={state}
        />
      </div>,
    );
  }

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">
          {novel.state == "unfetch" || novel.state == "fetching"
            ? "Loading... " + novel.url
            : novel.name}
        </h1>
      </div>
      <p class="text-2xl mb-6">
        {((novel.state == "translated"
          ? novel.description
          : novel.untranslatedDescription) as string).split("\n").map((x) => (
            <p>{x}</p>
          ))}
      </p>
      <div class="mt-9 rounded-lg border shadow-sm overflow-hidden p-6 space-y-8">
        {list}
      </div>
    </div>
  );
}
