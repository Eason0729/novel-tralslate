import { DataTypes, Model } from "denodb";

type state =
  | "unfetch"
  | "fetching"
  | "translating"
  | "translated"
  | "error";

class Entity extends Model {
  static table = "novel";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: DataTypes.string(64),
    state: DataTypes.STRING,
    untranslatedContent: DataTypes.STRING,
    content: DataTypes.STRING,
    index: DataTypes.INTEGER,
  };
}

export class Article {
  static entity = Entity;
  id: number;
  state: state;
  title: string;
  content: string;
  index: number;
  constructor(
    data: { id: number; state: state; title: string; content: string },
  ) {
    this.id = data.id;
    this.state = data.state;
    this.title = data.title;
    this.content = data.content;
  }
  static async list() {
  }
  static async get(id: number) {
  }
}
