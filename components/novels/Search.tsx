import { IconSearch } from "@tabler/icons-preact";

export default function Search() {
  return (
    <form class="flex gap-2 mb-4 text-lg" method="POST">
      <input
        class="flex w-full rounded-md border border-input bg-background px-5 py-2 flex-grow h-12 dark:text-black"
        placeholder="https://syosetu.org/novel/320080/"
        type="text"
        name="url"
        value=""
      />
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-slate-800 text-white dark:bg-slate-300 dark:text-blackz h-12 w-12"
        type="submit"
      >
        <IconSearch class="h-5 w-5" />
        <span class="sr-only">Search</span>
      </button>
    </form>
  );
}
