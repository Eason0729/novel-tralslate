import ErrorPage from "../components/ErrorPage.tsx";
import { getSupportedSources } from "../entity/crawler/mod.ts";

export default function Unsupported() {
  return (
    <ErrorPage code="400">
      <div class="min-w-fit text-left mb-4 mx-6">
        <p>
          Domain entered is not supported.
        </p>
        <p>
          Note that not all url formated are supported (usually mobile version
          url is not supported).
        </p>

        Following publisher are supported:
        <ul class="list-disc ml-5">
          {getSupportedSources().map((name) => <li class="my-2">{name}</li>)}
        </ul>
      </div>
    </ErrorPage>
  );
}
