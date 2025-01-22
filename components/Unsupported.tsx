import ErrorPage from "./ErrorPage.tsx";
import { getSupportedSourceInfos } from "../entity/crawler/mod.ts";

export default function Unsupported(
  { originalUrl, suggestedUrls }: {
    originalUrl: string;
    suggestedUrls: string[];
  },
) {
  return (
    <ErrorPage code="400" redirectUrl="/">
      <div class="min-w-fit text-left mb-4 mx-6 text-lg">
        <p>
          <span class="text-blue-700 dark:text-blue-300">
            {originalUrl}
          </span>{" "}
          is not supported.
        </p>
        {suggestedUrls.map((suggestedUrl) => (
          <p>
            Maybe you mean{" "}
            <span class="text-blue-700 dark:text-blue-300">
              {suggestedUrl}
            </span>?
          </p>
        ))}
        <hr class="mx-1 my-4" />
        Following publisher are supported:
        <ul class="list-disc ml-5">
          {getSupportedSourceInfos().map((source) => (
            <li class="my-2">
              <a
                href={source.baseUrl}
                class="text-blue-700 dark:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </ErrorPage>
  );
}
