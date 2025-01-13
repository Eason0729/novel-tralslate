import { IconLoader } from "@tabler/icons-preact";
import Footer from "./Footer.tsx";
import { Head } from "$fresh/runtime.ts";

export default function Loading() {
  return (
    <>
      <Head>
        <meta http-equiv="refresh" content="5" />
      </Head>
      <div class="flex flex-col items-center justify-center min-h-screen text-gray-800 dark:text-white">
        <IconLoader class="w-12 h-12 animate-spin" />
        <div class="text-center p-4">
          <h1 class="text-3xl font-bold">Fetching Novel...</h1>
          <p class="mt-2 text-lg animate-pulse">
            Please wait while we fetch the content for you.
          </p>
        </div>
        <Footer absolute />
      </div>
    </>
  );
}
