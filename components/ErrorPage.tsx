import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";

function getErrorTitle(code: number) {
  const codesMap = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Page Not Found",
    500: "Internal Server Error",
  };
  if (code in codesMap) return codesMap[code as keyof typeof codesMap];
  return `Unknown`;
}

export default function ErrorPage(
  { code, message, children, redirectUrl }: {
    code: number | string;
    message?: string;
    children?: ComponentChildren;
    redirectUrl?: string;
  },
) {
  return (
    <>
      {redirectUrl
        ? (
          <Head>
            <meta
              http-equiv="refresh"
              content={"30; url=" + (redirectUrl || "/")}
            />
          </Head>
        )
        : null}
      <Head>
        <title>{`${code} - ${getErrorTitle(+code)}`}</title>
      </Head>
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-6xl font-bold mb-4">{code}</h1>
        <h2 class="text-2xl mb-4" data-id="3">{getErrorTitle(+code)}</h2>

        <div class="mb-8 px-2 break-words">
          {children ? children : (
            <p>
              {message || "An error occurred on the server."}
            </p>
          )}
        </div>
        <a
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-white dark:text-black text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-black dark:bg-slate-100 hover:bg-slate-400 text-cyan-600-foreground h-10 px-4 py-2"
          href="/"
        >
          Go back home
        </a>
      </div>
    </>
  );
}
