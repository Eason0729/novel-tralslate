export default function TitleBar(
  { title, href }: { title: string; href: string },
) {
  return (
    <div class="flex justify-between items-center p-4 border-b">
      <h1 class="text-3xl font-bold overflow-hidden whitespace-nowrap mr-3">
        {title}
      </h1>
      <a
        class="dark:bg-slate-300 dark:text-black inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border py-1 px-2 h-12 w-12"
        type="button"
        href={href}
        aria-label="Back to novel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </a>
    </div>
  );
}
