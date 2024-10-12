import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div
        class="flex flex-col items-center justify-center min-h-screen"
        data-id="1"
      >
        <h1 class="text-6xl font-bold mb-4" data-id="2">404</h1>
        <h2 class="text-2xl mb-4" data-id="3">Page Not Found</h2>
        <p class="text-muted-foreground mb-8" data-id="4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          data-id="6"
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
