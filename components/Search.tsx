export default function Search() {
  return (
    <div class="flex-1 flex items-center justify-center p-8">
      <form class="w-full max-w-md" method="POST">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            class="flex h-10 rounded-md border border-input px-10 py-8 w-full text-2xl"
            placeholder=" untranslated novel url"
            type="text"
            name="url"
            value=""
          />
        </div>
      </form>
    </div>
  );
}
