import { Handlers, RouteContext } from "$fresh/server.ts";
import { Article } from "../../../entity/article.ts";

export const handler: Handlers = {
  async POST(_, ctx: RouteContext) {
    const { id } = ctx.params as { id: string };
    const article = await Article.getById(parseInt(id));
    await article.reset();
    await article.oneShot();
    return new Response(null, {
      status: 200,
    });
  },
};
