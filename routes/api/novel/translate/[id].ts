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
    articles.sort((a, b) => a.index as number - (b.index as number));

    await Promise.all(
      articles.filter((x) =>
        x.state != "translated" || x.title == x.translatedTitle
      ).map((artcle) => (artcle as Article).oneShot()),
    );

    return new Response(null, {
      status: 303,
      headers: {
        "location": "/novel/" + id,
      },
    });
  },
};
