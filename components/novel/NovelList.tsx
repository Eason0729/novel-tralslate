import { Novel } from "../../entity/novel.ts";

export default function NovelList({ novels }: { novels: Novel[] }) {
  return (
    <div class="p-4">
      <h1 class="text-black dark:text-white text-2xl font-bold mb-4">
        Recent Novels
      </h1>
      <ul class="text-gray-800 dark:text-gray-200">
        {novels.map((novel) => (
          <li class="mb-2 line-clamp-3">
            <nav>
              <a
                href={"/novel/" + novel.id}
                class="hover:text-gray-600 dark:hover:text-white"
              >
                {novel.name || novel.untranslatedName}
              </a>
            </nav>
          </li>
        ))}
      </ul>
    </div>
  );
}
