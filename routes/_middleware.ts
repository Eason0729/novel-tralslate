import { FreshContext } from "$fresh/server.ts";
import SetupDatabase from "../entity/db.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  SetupDatabase();

  const resp = await ctx.next();
  const url = req.url;
  if (url.endsWith(".css") || url.endsWith(".js") || url.endsWith(".svg")) {
    resp.headers.set("Cache-Control", "max-age=3600");
  }

  return resp;
}
