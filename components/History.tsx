import { Novel } from "../entity/novel.ts";

export interface HistoryProps {
  novels?: Novel[];
}
export default function History(props: HistoryProps) {
  const novels = props.novels || [];

  return (
    <>
      <div class="w-64 bg-white shadow-md">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Novels</h2>
        </div>
        <div
          dir="ltr"
          class="relative overflow-hidden h-[calc(100vh-60px)]"
          style="position: relative; --radix-scroll-area-corner-width: 0px; --radix-scroll-area-corner-height: 0px;"
        >
          <div
            class="h-full w-full rounded-[inherit]"
            style="overflow: hidden scroll;"
          >
            {novels.map((novel) => (
              <a href={"/novel/" + novel.id}>
                <div class="p-4 border-b">
                  <h3 class="text-lg font-semibold whitespace-nowrap overflow-x-hidden">
                    {novel.state == "unfetch" ? "fetching" : novel.name}
                  </h3>
                  <p class="text-sm text-gray-500">{novel.url}</p>
                </div>
              </a>
            ))}
            {novels.length === 0
              ? (
                <div style="min-width: 100%; display: table;">
                  <p class="p-4 text-sm text-gray-500">
                    No translated novels
                  </p>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
