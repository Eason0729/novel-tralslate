export default function HomeButton() {
  return (
    <a
      class="bg-black dark:bg-slate-300 dark:text-black inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 w-10 fixed bottom-20 md:bottom-4 right-4 rounded-full shadow-lg"
      href="/"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-settings h-6 w-6"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <span class="sr-only">Home Page</span>
    </a>
  );
}
