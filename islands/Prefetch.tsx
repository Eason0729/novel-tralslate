import { IS_BROWSER } from "$fresh/runtime.ts";

let quicklink: typeof import("https://esm.sh/quicklink@2.3.0") | undefined;
export default function Prefetch(
  { urls, partial }: { urls: (string | undefined)[]; partial?: boolean },
) {
  if (!IS_BROWSER) return null;

  urls = urls.filter((url): url is string => typeof url === "string");
  if (partial) urls = urls.map((url) => url + "?fresh-partial=true");

  (async () => {
    if (!quicklink) quicklink = await import("https://esm.sh/quicklink@2.3.0");
    try {
      await quicklink.prefetch(
        urls.filter((url): url is string => typeof url === "string"),
      );
    } catch (e) {
      console.warn(e);
    }
  })();

  return null;
}
