import { IS_BROWSER } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

export default function LoadBotton(props: {
  href: string;
  "f-partial": string;
  children?: ComponentChildren;
}) {
  if (!IS_BROWSER) {
    return (
      <div class="mt-6 text-center">
        <a
          href={props.href}
          f-partial={props["f-partial"]}
          f-client-nav
          class="text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
        >
          {props.children}
        </a>
      </div>
    );
  }
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entry, observer) => {
      if (entry.length == 0 || !entry[0].isIntersecting) return;
      observer.disconnect();
      ref.current?.click();
    }, {
      root: null,
      rootMargin: "1px",
      threshold: 0.2,
    });
    observer.observe(ref.current!);
  });

  return (
    <div class="mt-6 text-center">
      <button
        f-partial={props["f-partial"]}
        f-client-nav
        ref={ref}
        class="jsonly text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
      >
        Load More
      </button>
    </div>
  );
}
