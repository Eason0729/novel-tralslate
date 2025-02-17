import { DB as NativeDatabase } from "sqlite";
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
  const [result] = db.query(
    "SELECT version FROM migration ORDER BY version DESC LIMIT 1;",
  ).values();
  return result ? result[0] as number : 0;
}

export async function runMigrations(path: string): Promise<void> {
  const db = new NativeDatabase(path);
  db.execute("CREATE TABLE IF NOT EXISTS migration(version INTEGER);");

  const version = getMigratingVersion(db);

  const promises: Promise<void>[] = [];

  for (let i = version; i < migrations.length; i++) {
    console.log(`Running migration %c"${migrations[i].name}"`, "color: green");
    promises.push(migrations[i].up(db));
    db.query("INSERT INTO migration(version) VALUES(?);", [i + 1]);
  }

  await Promise.all(promises);
  return db.close();
}
