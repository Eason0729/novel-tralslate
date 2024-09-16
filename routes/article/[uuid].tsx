import { RouteContext } from "$fresh/server.ts";
import { Novel } from "../../novel/mod.ts";
import { UuidMap } from "../mod.ts";
import { uuidMap as novelMap } from "../novel/[uuid].tsx";

/**
 * Map uuid to url of article
 */
export const uuidMap: UuidMap<[Novel, number]> = new UuidMap();

export default async function ArticlePage(_: Request, ctx: RouteContext) {
  const { uuid } = ctx.params as { uuid: string };
  const [novel, index] = uuidMap.get(uuid) as [Novel, number];

  const novelUuid = novelMap.add(novel);

  const previousUuid = index >= 1 ? uuidMap.add([novel, index - 1]) : undefined;
  const nextUuid = index < novel.articles.length - 1
    ? uuidMap.add([novel, index + 1])
    : undefined;

  const content = await novel.articles[index].getContent();

  return (
    <div
      class="!visible transition-opacity duration-150 !opacity-100"
      id="v0-container"
      style="visibility:hidden;opacity:0"
    >
      <div class="flex flex-col h-screen max-w-3xl mx-auto">
        <header class="flex justify-between items-center p-4 border-b">
          <h1 class="text-2xl font-bold">The Great Gatsby</h1>
          <a
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border h-10 w-10"
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:r3:"
            href={"/novel/" + novelUuid}
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
              class="h-4 w-4"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </a>
        </header>
        <main class="flex-grow overflow-auto p-6">
          <h2 class="text-xl font-semibold mb-4">
            {novel.articles[index].title}
          </h2>
          <p class="text-lg leading-relaxed">
            {content.split("\n").map((x) => <p>{x}</p>)}
          </p>
        </main>
        <footer class="flex justify-between p-4 border-t">
          {previousUuid
            ? (
              <a href={"/article/" + previousUuid}>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2">
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
                    class="lucide lucide-chevron-left h-4 w-4 mr-2"
                  >
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                  Previous
                </button>
              </a>
            )
            : undefined}

          {nextUuid
            ? (
              <a href={"/article/" + nextUuid}>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2">
                  Next
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
                    class="lucide lucide-chevron-right h-4 w-4 ml-2"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </button>
              </a>
            )
            : undefined}
        </footer>
      </div>
    </div>
  );
}
