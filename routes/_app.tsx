import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="zh-tw">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>輕小說翻譯</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="bg-white dark:bg-slate-900 text-black dark:text-white h-screen">
          <Component />
        </div>
      </body>
    </html>
  );
}
