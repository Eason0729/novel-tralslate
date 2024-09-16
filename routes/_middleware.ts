import { FreshContext } from "$fresh/server.ts";
import SetupDatabase from "../entity/db.ts";

interface State {
  data: string;
}

export async function handler(
  _: Request,
  ctx: FreshContext<State>,
) {
  SetupDatabase();
  return await ctx.next();
}
