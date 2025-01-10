import { Article, State as ArticleState } from "../../entity/article.ts";
import StartButton from "../../islands/StartButton.tsx";
import type { buttonState } from "../../islands/StartButton.tsx";

export default function ArticleEntry(
  { article, addIndex }: { article: Article; addIndex?: boolean },
) {
  const stateMap: Record<ArticleState, buttonState> = {
    unfetch: "start",
    fetching: "running",
    fetched: "running",
    translating: "running",
    translated: "retry",
    error: "retry",
  };
  const state = stateMap[article.state as ArticleState];

  const title = article.title as string;
  const index = article.index as number;
  return (
    <li
      key={`frag-novel-list-${index}`}
      class="block p-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black shadow transition duration-300"
    >
      <div class="flex justify-between items-center tracking-tight text-2xl px-2">
        <a
          href={"/article/" + article.id}
          class="flex mr-3 line-clamp-2"
        >
          {addIndex ? `第${index + 1}話 ${title.trim()}` : title.trim()}
        </a>
        <div class="flex items-center">
          <a
            href={"/article/" + article.id}
            class="border-l-[3px] border-blue-400 dark:border-slate-300 visited:border-white dark:visited:border-blue-600 h-full pl-1"
            disabled
            tabIndex={-1}
            aria-label="translated"
          >
            {"\u200B"}
          </a>
          <StartButton
            articleId={article.id as number}
            state={state}
          />
        </div>
      </div>
    </li>
  );
}
