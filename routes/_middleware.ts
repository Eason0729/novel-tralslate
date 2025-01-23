import { FreshContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const resp = await ctx.next();

  if (Deno.env.get("PRODUCTION") === "0") return resp;

  const cacheExtensions = [".css", ".js", ".svg", ".ico"];
  for (const ext of cacheExtensions) {
    if (req.url.endsWith(ext)) {
      resp.headers.set("Cache-Control", "max-age=3600");
    }
  }

  return resp;
}
