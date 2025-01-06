import { Partial } from "$fresh/runtime.ts";

export default function NovelLoad({ page, novelId }: {
  novelId: number;
  page: number;
}) {
  return (
    <Partial name="novel-load">
      <div class="mt-6 text-center">
        <noscript>
          <a
            href={`/novel/${novelId}/${page + 1}`}
            class="text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
          >
            Load More
          </a>
        </noscript>
        <button
          href={`/novel/${novelId}/${page + 1}`}
          f-partial={`/partial/novel/${novelId}/${page + 1}`}
          f-client-nav
          class="jsonly text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
        >
          Load More
        </button>
      </div>
    </Partial>
  );
}
