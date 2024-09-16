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
    <div class="flex h-screen bg-gray-100">
      <div class="hidden md:block">
        <History novels={novels as Novel[]} />
      </div>
      <div class="flex-1 flex flex-col">
        <Search />
      </div>
    </div>
  );
}
