import { Handlers } from "$fresh/server.ts";

import { Novel } from "../entity/novel.ts";

import History from "../components/History.tsx";
import Search from "../components/Search.tsx";

export const handler: Handlers = {
  GET(_, ctx) {
    return ctx.render();
  },
  async POST(req, _) {
    const form = await req.formData();

    const url = form.get("url") as string;
    const novel = await Novel.fromUrl(url);
    if (novel == undefined) return new Response("Not Found", { status: 404 });

    const headers = new Headers();
    headers.set("location", "/novel/" + novel.id);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default async function Home() {
  const novels = await Novel.all();
  return (
    <div class="w-full max-w-lg mx-auto rounded-lg py-10 px-4">
      <Search />
      <History novels={novels as Novel[]} />
    </div>
  );
}
