import { Database, SQLite3Connector } from "denodb";
import { DataTypes, Model } from "denodb";
import { Relationships } from "denodb";
import { Novel } from "./novel.ts";
import { Article } from "./article.ts";

export class Note extends Model {
  static table = "note";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.string(64),
    content: DataTypes.STRING,
  };
  printContent() {
    console.log(this.content);
  }
}

const connector = new SQLite3Connector({
  filepath: "./database.sqlite",
});

export const db = new Database(connector);

Relationships.belongsTo(Article.entity, Novel.entity);

db.link([Note]);
await db.sync({ drop: true });
