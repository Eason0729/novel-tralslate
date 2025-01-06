import { ComponentChildren } from "preact";
import Paragraph from "../Paragraph.tsx";
import RandomBar from "../RandomBar.tsx";
import { Partial } from "$fresh/runtime.ts";

export default function TextView(
  { content, children }: { content: string; children?: ComponentChildren },
) {
  return (
    <Partial name="article-reader">
      <div class="flex-grow p-6 snap-proximity">
        <h2 class="text-2xl font-semibold mb-4">
          {children}
        </h2>
        <Paragraph content={content} animation />
        <RandomBar />
      </div>
    </Partial>
  );
}
