import { Database as NativeDatabase } from "sqlite";
import AddIndexMigration from "./add-index.ts";
import DuplicateTranslationTitleMigration from "./duplicate-translation-title.ts";

export interface Migration {
  name: string;
  up(db: NativeDatabase): Promise<void>;
  down(db: NativeDatabase): Promise<void>;
}

const migrations: Migration[] = [
  new AddIndexMigration(),
  new DuplicateTranslationTitleMigration(),
];

function getMigratingVersion(db: NativeDatabase): number {
  const result = db.prepare(
    "SELECT version FROM migration ORDER BY version DESC LIMIT 1;",
  ).value();
  if (!result) return 0;
  return result![0] as number;
}

export async function runMigrations(path: string): Promise<void> {
  const db = new NativeDatabase(path);
  db.exec("CREATE TABLE IF NOT EXISTS migration(version INTEGER);");

  const version = getMigratingVersion(db);

  const promises: Promise<void>[] = [];

  for (let i = version; i < migrations.length; i++) {
    console.log("running migration", migrations[i].name);
    promises.push(migrations[i].up(db));
    db.run("INSERT INTO migration(version) VALUES(?);", [i + 1]);
  }

  await Promise.all(promises);
  return db.close();
}
