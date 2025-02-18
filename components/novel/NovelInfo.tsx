import { Head } from "$fresh/runtime.ts";
import { Novel } from "../../entity/novel.ts";
import ActionButton from "../../islands/ActionButton.tsx";
import Paragraph from "../Paragraph.tsx";

export default function NovelInfo({ novel }: { novel: Novel }) {
  const description =
    (novel.state == "translated"
      ? novel.description
      : novel.untranslatedDescription) as string;
  const name = novel.name || novel.untranslatedName;

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div class="text-center">
        {novel.state == "unfetch" || novel.state == "fetching"
          ? (
            <div class="animate-pulse">
              <div class="h-4 my-6 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          )
          : (
            <h1 class="text-4xl font-bold mb-4">
              {name}
            </h1>
          )}
      </div>
      <label class="text-gray-800 dark:text-gray-200">
        <span class="sr-only">Description</span>
        <input
          type="checkbox"
          name="novel-details"
          value="value"
          class="peer/novel-details h-0 w-0 absolute"
        />
        <div class="line-clamp-4 peer-checked/novel-details:line-clamp-none cursor-pointer peer-checked/novel-details:cursor-default">
          <Paragraph content={description} />
          <div class="flex space-x-4 py-2">
            <ActionButton type="reload" novelId={novel.id as number} />
            <ActionButton type="translate" novelId={novel.id as number} />
          </div>
        </div>
        <div class="hover:text-gray-600 dark:hover:text-white cursor-pointer peer-checked/novel-details:hidden">
          <div class="flex justify-end">
            Click for more
          </div>
        </div>
      </label>
    </>
  );
}
