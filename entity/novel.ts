import { DataTypes, Model } from "denodb";

type state = "untranslated" | "translating" | "translated";

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
    description: DataTypes.STRING,
  };
}

export class Novel {
  static entity = Entity;
  id: number;
  state: state;
  title: string;
  content: string;
  constructor(
    data: { id: number; state: state; title: string; description: string },
  ) {
    this.id = data.id;
    this.state = data.state;
    this.title = data.title;
    this.content = data.description;
  }
}
