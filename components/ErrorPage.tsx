import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";

function getErrorTitle(code: number) {
  switch (code) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Page Not Found";
  }
  return `Unknown`;
}

export default function ErrorPage(
  props: {
    code: number | string;
    message?: string;
    children?: ComponentChildren;
  },
) {
  let code = +props.code;
  return (
    <>
      <Head>
        <title>{`${code} - ${getErrorTitle(code)}`}</title>
      </Head>
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <h2 class="text-2xl mb-4" data-id="3">{getErrorTitle(code)}</h2>

        {props.children
          ? props.children
          : (
            <p class="text-muted-foreground mb-8">
              {props.message || "An error occurred on the server."}
            </p>
          )}
        <a
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-white dark:text-black text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-black dark:bg-slate-100 text-cyan-600-foreground h-10 px-4 py-2"
          href="/"
          rel="ugc"
        >
          Go back home
        </a>
      </div>
    </>
  );
}
