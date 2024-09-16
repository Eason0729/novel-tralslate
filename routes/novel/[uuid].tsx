import { Novel } from "../../novel/mod.ts";
import { UuidMap } from "../mod.ts";
import { uuidMap as articleMap } from "../article/[uuid].tsx";
import { PageProps } from "$fresh/server.ts";
import { StartButton } from "../../islands/StartButton.tsx";

/**
 * Map uuid to url of novel
 */
export const uuidMap: UuidMap<Novel> = new UuidMap();

export default function NovelPage(
  { params: { uuid } }: PageProps<{ uuid: string }>,
) {
  const novel = uuidMap.get(uuid) as Novel;
  if (!novel) throw new Error("Novel not found");

  const list = [];
  for (const [index, article] of novel.articles.entries()) {
    const articleUuid = articleMap.add([novel, index]);
    list.push(
      <div class="flex justify-between items-center whitespace-nowrap font-semibold tracking-tight text-2xl mb-2">
        <a href={"/article/" + articleUuid}>
          <span>
            Web {index + 1} {article.title}
          </span>
        </a>
        <StartButton
          url={"/article/" + articleUuid}
          started={article.status != "unfetch"}
        />
      </div>,
    );
  }

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">
          {novel.name}
        </h1>
      </div>
      <p class="text-xl text-muted-foreground mb-6">
        {novel.description.split("\n").map((x) => <p>{x}</p>)}
      </p>
      <div class="mt-9 rounded-lg border shadow-sm overflow-hidden p-6 space-y-8">
        {list}
      </div>
    </div>
  );
}
