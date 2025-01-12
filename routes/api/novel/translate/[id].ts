import { Handlers, RouteContext } from "$fresh/server.ts";
import { Article } from "../../../../entity/article.ts";
import { Novel } from "../../../../entity/novel.ts";

export const handler: Handlers = {
  async POST(_, ctx: RouteContext) {
    const { id } = ctx.params as { id: string };
    const novel = await Novel.getById(parseInt(id));
    if (!novel) {
      return new Response(null, {
        status: 404,
      });
    }

    const articles = await Article.where("novelId", id).all();
    await Promise.all(
      articles.map((artcle) => (artcle as Article).translate()),
    );

    return new Response(null, {
      status: 303,
      headers: {
        "location": "/novel/" + id,
      },
    });
  },
};
