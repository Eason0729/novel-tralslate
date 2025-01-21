import { Partial } from "$fresh/runtime.ts";
import ArrowButton from "../../islands/ArrowButton.tsx";
import { IconArrowBarDown, IconArrowBarUp } from "@tabler/icons-preact";

export default function Footer(
  { previousUrl, nextUrl }: { previousUrl?: string; nextUrl?: string },
) {
  return (
    <footer class="sticky bottom-0" tabIndex={-1}>
      <label>
        <input
          type="checkbox"
          name="footer-panel"
          value="value"
          class="peer/footer-panel h-0 w-0 absolute"
          checked
        />
        <span class="sr-only">navigation panel</span>
        <div
          class="justify-center pt-1 cursor-pointer flex peer-checked/footer-panel:hidden"
          tabIndex={0}
        >
          <IconArrowBarUp class="h-9 w-9 p-1 bg-slate-600 text-white rounded-full animate-bounce peer-checked/footer-panel" />
          <span class="sr-only">open panel</span>
        </div>
        <div class="justify-between p-4 border-t cursor-pointer bg-white dark:bg-slate-900 hidden peer-checked/footer-panel:flex">
          <Partial name="article-footer">
            <ArrowButton
              disabled={!previousUrl}
              direction="left"
              href={previousUrl}
            />
            <span tabIndex={0}>
              <IconArrowBarDown class="pt-1 animate-bounce h-10 w-10 p-2" />
            </span>
            {nextUrl
              ? <ArrowButton direction="right" href={nextUrl} />
              : <div />}
          </Partial>
        </div>
      </label>
    </footer>
  );
}
