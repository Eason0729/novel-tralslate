import { Handlers } from "$fresh/server.ts";

import { Novel } from "../entity/novel.ts";

import History from "../components/novels/History.tsx";
import Search from "../components/novels/Search.tsx";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    const url = form.get("url") as string;
    let novel, redirectUrl;
    try {
      novel = await Novel.fromUrl(url);
    } catch (e) {
      console.warn(e);
      redirectUrl = "/unsupported";
    }
    if (!redirectUrl && novel) redirectUrl = "/novel/" + novel.id;

    if (!redirectUrl) return ctx.renderNotFound();

    const headers = new Headers();
    headers.set("location", redirectUrl);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default async function Home() {
  const novels = await Novel.where("hidden", false).all();
  return (
    <div class="w-full max-w-4xl mx-auto rounded-lg py-10 px-4">
      <Search />
      <History novels={novels as Novel[]} />
    </div>
  );
}
