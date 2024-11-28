import { Novel } from "../../entity/novel.ts";

export default function NovelInfo({ novel }: { novel: Novel }) {
  return (
    <div class="text-center">
      {novel.state == "unfetch" || novel.state == "fetching"
        ? (
          <div class="animate-pulse">
            <div class="h-4 my-6 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        )
        : <h1 class="text-4xl font-bold mb-4">{novel.name}</h1>}
    </div>
  );
}
