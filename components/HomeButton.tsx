import { IconHome2 } from "@tabler/icons-preact";

export default function HomeButton() {
  return (
    <a
      class="bg-black dark:bg-slate-300 text-white dark:text-black inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 w-10 fixed bottom-20 md:bottom-4 right-4 rounded-full shadow-lg"
      href="/"
    >
      <IconHome2 class="w-8 h-8" />
      <span class="sr-only">Home Page</span>
    </a>
  );
}
