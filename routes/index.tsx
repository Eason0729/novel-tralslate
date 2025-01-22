import { Handlers } from "$fresh/server.ts";

import { Novel } from "../entity/novel.ts";

import History from "../components/novels/History.tsx";
import Footer from "../components/Footer.tsx";
import SetupInstruction from "../components/novels/SetupInstruction.tsx";
import PrefixComplete from "../islands/PrefixComplete.tsx";
import { getSupportedSourceInfos } from "../entity/crawler/mod.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    const url = form.get("url") as string;
    let novel, redirectUrl;
    try {
      novel = await Novel.fromUrl(url);
    } catch (e) {
      console.warn(e);
      redirectUrl = "/unsupported/" + encodeURIComponent(url);
    }
    if (!redirectUrl && novel) redirectUrl = "/novel/" + novel.id;

    if (!redirectUrl) return ctx.renderNotFound();

    novel?.oneShot();

    const headers = new Headers();
    headers.set("location", redirectUrl);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default async function Home() {
  const novels = await Novel.where("hidden", false).orderBy("updatedAt", "desc")
    .all();
  return (
    <div class="w-full max-w-4xl mx-auto rounded-lg py-10 px-4 min-h-[100vh] flex flex-col">
      <PrefixComplete
        prefixs={getSupportedSourceInfos().map((x) => x.baseUrl)}
        placeholder="https://auto-complete-is-enable-island.vercel.app"
      />
      <div class="flex-grow">
        {novels.length > 0
          ? <History novels={novels as Novel[]} />
          : <SetupInstruction />}
      </div>
      <Footer />
    </div>
  );
}
