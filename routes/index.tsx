import { Handlers } from "$fresh/server.ts";

import { uuidMap as novelMap } from "./novel/[uuid].tsx";
import { Collection } from "./mod.ts";

import History from "../components/History.tsx";
import Search from "../components/Search.tsx";

export const handler: Handlers = {
  GET(_, ctx) {
    return ctx.render();
  },
  async POST(req, _) {
    const form = await req.formData();

    const novel = await Collection.getNovel(form.get("url") as string);
    if (novel == undefined) return new Response("Not Found", { status: 404 });

    const uuid = novelMap.add(novel);

    const headers = new Headers();
    headers.set("location", "/novel/" + uuid);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Home() {
  return (
    <div class="flex h-screen bg-gray-100">
      <div class="hidden md:block">
        <History />
      </div>
      <div class="flex-1 flex flex-col">
        <Search />
      </div>
    </div>
  );
}
