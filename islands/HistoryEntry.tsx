import { useState } from "preact/hooks";
import { Novel } from "../entity/novel.ts";
import { IconX } from "@tabler/icons-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function HistoryEntry(props: { novel: Novel }) {
  const [hidden, setHidden] = useState(false);
  const novel = props.novel;

  const displayName = novel.name || novel.untranslatedName;
  const nameAvailable = displayName != "";

  if (!IS_BROWSER) {
    return (
      <li class="flex items-center justify-between bg-blue-500 dark:hover:bg-slate-300 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black p-3 rounded text-lg">
        <a href={"/novel/" + novel.id} class="flex-1 overflow-ellipsis">
          {nameAvailable ? displayName : `${novel.state}: ${novel.url}`}
        </a>
        <form action={"/api/novel/delete/" + novel.id} method="POST">
          <button
            type="submit"
            class="inline-flex items-center justify-between whitespace-nowrap rounded-md font-medium h-10 !w-7"
          >
            <IconX class="h-5 w-5" />
            <span class="sr-only">Remove</span>
          </button>
        </form>
      </li>
    );
  }
  return hidden
    ? null
    : (
      <li class="flex items-center justify-between bg-blue-500 dark:hover:bg-slate-300 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black p-3 rounded text-lg">
        <a href={"/novel/" + novel.id} class="flex-1 overflow-ellipsis">
          {nameAvailable ? displayName : `${novel.state}: ${novel.url}`}
        </a>
        <button
          class="jsonly inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium h-10 !w-7"
          onClick={() => {
            setHidden(true);
            fetch("/api/novel/delete/" + novel.id, { method: "POST" });
          }}
        >
          <IconX class="h-5 w-5" />
          <span class="sr-only">Remove</span>
        </button>
      </li>
    );
}
