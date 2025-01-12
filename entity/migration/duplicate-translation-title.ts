import { Database } from "sqlite";
import { Migration } from "./mod.ts";

export default class DuplicateTranslationTitleMigration implements Migration {
  name = "duplicate-translation-title";
  up(db: Database): Promise<void> {
    try {
      db.run(
        `ALTER TABLE novel ADD COLUMN untranslated_name VARCHAR(64) DEFAULT ''`,
      );
    } catch (_) {
      return Promise.resolve();
    }

    db.run(
      `ALTER TABLE article ADD COLUMN untranslated_title VARCHAR(128) DEFAULT ''`,
    );
    db.run(
      `UPDATE novel SET untranslated_name = name WHERE untranslated_name = ''`,
    );
    db.run(
      `UPDATE article SET untranslated_title = title WHERE untranslated_title = ''`,
    );
    return Promise.resolve();
  }

  down(): Promise<void> {
    return Promise.resolve();
  }
}
