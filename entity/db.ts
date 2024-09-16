import { Database, Model, SQLite3Connector } from "@denodb";
import { Relationships } from "@denodb";
import { Novel } from "./novel.ts";
import { Article } from "./article.ts";

const connector = new SQLite3Connector({
  filepath: Deno.env.get("SQLITE_PATH") || "./database.sqlite",
});

export const db = new Database(connector);

Relationships.belongsTo(Article, Novel);

db.link([Article, Novel]);
await db.sync({});

let isSetup = false;
export default async function SetupDatabase() {
  if (isSetup) return db;
  isSetup = true;

  const ops = await Promise.all([
    Article.where("state", "fetching").update({
      state: "unfetch",
    }),
    Article.where("state", "translating").update({
      state: "fetched",
    }),
    Novel.where("state", "fetching").update({
      state: "unfetch",
    }),
    Novel.where("state", "translating").update({
      state: "fetched",
    }),
  ]) as Model[];
  const changes = ops.map((x) => x.affectedRows as number).reduce(
    (a, b) => a + b,
    0,
  );
  
  if (changes > 0) {
    console.info("Recovered from previous crash, reset", changes, "rows");
  }

  return db;
}
