import { Partial } from "$fresh/runtime.ts";
import ArrowButton from "../../islands/ArrowButton.tsx";
import { IconArrowBarUp } from "@tabler/icons-preact";

export default function Footer(
  { previousUrl, nextUrl }: { previousUrl?: string; nextUrl?: string },
) {
  return (
    <footer class="sticky bottom-0">
      <label>
        <input
          type="checkbox"
          name="footer-panel"
          value="value"
          class="peer/footer-panel h-0 w-0 absolute"
        />
        <div class="flex justify-center pt-1 cursor-pointer">
          <IconArrowBarUp class="h-9 w-9 p-1 bg-slate-600 text-white rounded-full animate-bounce peer-checked/footer-panel" />
          <span class="sr-only">open panel</span>
        </div>
        <div class="justify-between p-4 border-t bg-white dark:bg-slate-900 hidden peer-checked/footer-panel:flex">
          <Partial name="article-footer">
            <ArrowButton
              disabled={!previousUrl}
              direction="left"
              href={previousUrl}
            />
            {nextUrl ? <ArrowButton direction="right" href={nextUrl} /> : null}
          </Partial>
        </div>
      </label>
    </footer>
  );
}
