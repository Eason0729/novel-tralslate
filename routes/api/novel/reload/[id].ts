import { Handlers, RouteContext } from "$fresh/server.ts";
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

    await novel.reset();
    await novel.oneShot();

    return new Response(null, {
      status: 303,
      headers: {
        "location": "/novel/" + id,
      },
    });
  },
};
