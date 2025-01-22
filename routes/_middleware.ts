import { FreshContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const resp = await ctx.next();
  const url = req.url;
  const cacheExtensions = [".css", ".js", ".svg", ".ico"];
  for (const ext of cacheExtensions) {
    if (url.endsWith(ext)) {
      resp.headers.set("Cache-Control", "max-age=3600");
    }
  }

  return resp;
}
