export default function Search() {
  return (
    <form class="flex gap-2 mb-4 text-lg" method="POST">
      <input
        class="flex w-full rounded-md border border-input bg-background px-5 py-2 flex-grow h-12 dark:text-black"
        placeholder="Enter novel url"
        type="text"
        name="url"
        value=""
      />
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-slate-800 text-white dark:bg-slate-300 dark:text-blackz h-12 w-12"
        type="submit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <span class="sr-only">Search</span>
      </button>
    </form>
  );
}
