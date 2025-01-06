import { Novel } from "../../entity/novel.ts";
import HistoryEntry from "../../islands/HistoryEntry.tsx";
import SetupInstruction from "./SetupInstruction.tsx";
import { IconTrash } from "@tabler/icons-preact";

export interface HistoryProps {
  novels?: Novel[];
}
export default function History(props: HistoryProps) {
  const novels = props.novels || [];

  return (
    <>
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold py-2">Recent Novels</h2>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 disabled:hidden"
          disabled
        >
          <IconTrash class="lucide lucide-trash2 h-4 w-4 mr-2" />
          Clear All
        </button>
      </div>
      <ul class="space-y-2">
        {novels.length === 0
          ? <SetupInstruction />
          : novels.map((novel) => (
            <HistoryEntry novel={novel} key={`novel-${novel.id}`} />
          ))}
      </ul>
    </>
  );
}
