import { RouteContext } from "$fresh/server.ts";
import Unsupported from "../../components/Unsupported.tsx";
import { fixUrl } from "../../entity/url-helper.ts";

export default async function NovelPage(_: Request, ctx: RouteContext) {
  const encodedUrl = ctx.params.url as string;
  const url = decodeURIComponent(encodedUrl);

  const suggestedUrls = await fixUrl(url);

  return <Unsupported originalUrl={url} suggestedUrls={suggestedUrls} />;
}
