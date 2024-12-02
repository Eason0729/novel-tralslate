import { Handlers, RouteContext } from "$fresh/server.ts";
import { Article } from "../../../entity/article.ts";

export const handler: Handlers = {
  /**
   * Rerun translation for an article.
   * @returns
   */
  async POST(_, ctx: RouteContext) {
    const { id } = ctx.params as { id: string };
    const article = await Article.getById(parseInt(id));
    if (!article) {
      return new Response(null, {
        status: 404,
      });
    }
    await article.reset();
    await article.oneShot();

    return new Response(null, {
      status: 303,
      headers: {
        "location": `/novel/${article.novelId}`,
      },
    });
  },
};
