import { Database } from "sqlite";
import { Migration } from "./mod.ts";

export default class AddIndexMigration implements Migration {
  name = "add-index";
  up(db: Database): Promise<void> {
    db.run(
      `CREATE INDEX IF NOT EXISTS article_index ON article("index", "novel_id");`,
    );
    db.run(`CREATE INDEX IF NOT EXISTS novel_index ON novel("url");`);
    return Promise.resolve();
  }

  down(): Promise<void> {
    return Promise.resolve();
  }
}
