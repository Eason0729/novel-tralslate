import { FreshContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const resp = await ctx.next();

  const cacheExtensions = [".css", ".js", ".svg", ".ico"];

  if (
    req.headers.get("Sec-Purpose") === "prefetch" ||
    req.headers.get("purpose") === "prefetch"
  ) {
    resp.headers.set("Cache-Control", "max-age=300");
  }

  if (Deno.env.get("PRODUCTION") === "0") return resp;

  for (const ext of cacheExtensions) {
    if (req.url.endsWith(ext)) {
      resp.headers.set("Cache-Control", "max-age=3600");
    }
  }

  return resp;
}
