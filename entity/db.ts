import { Database, Model, SQLite3Connector } from "@denodb";
import { Relationships } from "@denodb";
import { Novel } from "./novel.ts";
import { Article } from "./article.ts";
import { Database as NativeDatabase } from "sqlite";

const FILEPATH = Deno.env.get("SQLITE_PATH") || "./database.sqlite3";
const connector = new SQLite3Connector({
  filepath: FILEPATH,
});

export const db = new Database(connector);

Relationships.belongsTo(Article, Novel);

db.link([Article, Novel]);
await db.sync({});

async function recoverTable() {
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

  Article.where("state", "fetched").orderBy("id").all().then(
    async (articles) => {
      for (const article of articles as Article[]) await article.oneShot();
    },
  );

  if (changes > 0) {
    console.info("Recovered from previous crash, reset", changes, "rows");
  }
}

// FIXME: this block thread
function createIndex() {
  const db = new NativeDatabase(FILEPATH);
  db.run(
    `CREATE INDEX IF NOT EXISTS article_index ON article("index", "novel_id");`,
  );
  db.run(`CREATE INDEX IF NOT EXISTS novel_index ON novel("url");`);
}

/**
 * @warn Don't call this function more than once
 * @returns {Database}
 */
export default function SetupDatabase(): Database {
  if (Deno.env.get("BYPASS_DATABASE_MIGRATION") == "1") {
    console.warn("Bypassing database migration");
  } else {
    console.info("Detecting database migration");
    createIndex();
  }

  recoverTable();

  return db;
}
