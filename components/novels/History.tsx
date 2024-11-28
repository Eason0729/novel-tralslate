import { Partial } from "$fresh/runtime.ts";
import { Novel } from "../../entity/novel.ts";
import HistoryEntry from "../../islands/HistoryEntry.tsx";

export interface HistoryProps {
  novels?: Novel[];
}
export default function History(props: HistoryProps) {
  const novels = props.novels || [];

  return (
    <>
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">Recent Novels</h2>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3"
          disabled
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash2 h-4 w-4 mr-2"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" x2="10" y1="11" y2="17"></line>
            <line x1="14" x2="14" y1="11" y2="17"></line>
          </svg>
          Clear All
        </button>
      </div>
      <ul class="space-y-2">
        {novels.map((novel) => <HistoryEntry novel={novel} />)}
      </ul>
    </>
  );
}
