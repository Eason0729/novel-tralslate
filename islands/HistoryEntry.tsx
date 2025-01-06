import { useState } from "preact/hooks";
import { Novel } from "../entity/novel.ts";
import { IconX } from "@tabler/icons-preact";

export default function HistoryEntry(props: { novel: Novel }) {
  const [hidden, setHidden] = useState(false);
  const novel = props.novel;
  const nameAvailable = novel.name != "";

  return hidden
    ? null
    : (
      <li class="flex items-center justify-between bg-slate-100 dark:text-black p-3 rounded text-lg">
        <a href={"/novel/" + novel.id} class="flex-1 overflow-ellipsis">
          {nameAvailable ? novel.name : `${novel.state}: ${novel.url}`}
        </a>
        <noscript>
          <form action={"/api/novel/" + novel.id} method="POST">
            <button
              type="submit"
              class="inline-flex items-center justify-between whitespace-nowrap rounded-md font-medium h-10 !w-7"
            >
              <IconX class="h-5 w-5" />
              <span class="sr-only">Remove</span>
            </button>
          </form>
        </noscript>
        <button
          class="jsonly inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium h-10 !w-7"
          onClick={() => {
            setHidden(true);
            fetch("/api/novel/" + novel.id, { method: "POST" });
          }}
        >
          <IconX class="h-5 w-5" />
          <span class="sr-only">Remove</span>
        </button>
      </li>
    );
}
