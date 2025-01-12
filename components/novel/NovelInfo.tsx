import { Novel } from "../../entity/novel.ts";
import ActionButton from "../../islands/ActionButton.tsx";
import Paragraph from "../Paragraph.tsx";

export default function NovelInfo({ novel }: { novel: Novel }) {
  const description =
    (novel.state == "translated"
      ? novel.description
      : novel.untranslatedDescription) as string;

  return (
    <>
      <div class="text-center">
        {novel.state == "unfetch" || novel.state == "fetching"
          ? (
            <div class="animate-pulse">
              <div class="h-4 my-6 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          )
          : (
            <h1 class="text-4xl font-bold mb-4">
              {novel.name || novel.untranslatedName}
            </h1>
          )}
      </div>
      <Paragraph content={description} />
      <div class="flex justify-between space-x-4 py-2">
        <ActionButton type="reload" novelId={novel.id as number} />
        <ActionButton type="translate" novelId={novel.id as number} />
      </div>
    </>
  );
}
