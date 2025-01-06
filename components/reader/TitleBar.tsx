import { IconListLetters } from "@tabler/icons-preact";

export default function TitleBar(
  { title, href }: { title: string; href: string },
) {
  return (
    <div class="flex justify-between items-center p-4 border-b">
      <h1 class="text-3xl font-bold overflow-hidden whitespace-nowrap mr-3">
        {title}
      </h1>
      <a
        class="dark:bg-slate-300 dark:text-black inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border p-2"
        href={href}
        aria-label="Back to novel"
      >
        <IconListLetters class="h-5 w-5" />
      </a>
    </div>
  );
}
