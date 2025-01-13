import { getSupportedSources } from "../../entity/crawler/mod.ts";

export default function SetupInstruction() {
  return (
    <div class="p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white text-lg rounded-md border border-blue-300 dark:border-blue-600 space-y-1">
      <h4 class="text-2xl mb-3">No novels found.</h4>
      <p>
        Use the Search bar to find novels.
      </p>
      <p>URL must be home page of the each novel.</p>
      <div class="py-4">
        <hr class="border-t-blue-800 dark:border-t-white" />
      </div>
      <p>
        Following publisher are supported:
        <ul class="list-disc ml-5">
          {getSupportedSources().map((source) => (
            <li class="my-2">
              <a
                href={source.baseUrl}
                class="text-blue-700 dark:text-blue-100 hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
}
