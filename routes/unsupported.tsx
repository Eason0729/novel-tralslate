import ErrorPage from "../components/ErrorPage.tsx";
import { getSupportedSources } from "../entity/crawler/mod.ts";

export default function Unsupported() {
  return (
    <ErrorPage code="400">
      <div class="min-w-fit text-left mb-4 mx-6 text-lg">
        <p>
          url entered is not supported.
        </p>
        <p>
          Note that not all url formated are supported (usually mobile version
          url is not supported).
        </p>
        <hr class="mx-1 my-4" />
        Following publisher are supported:
        <ul class="list-disc ml-5">
          {getSupportedSources().map((source) => (
            <li class="my-2">
              <a href={source.baseUrl} class="text-blue-700 dark:text-blue-300">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </ErrorPage>
  );
}
