import { NovelCollection } from "../novel/mod.ts";

export const Collection = new NovelCollection();

export class UuidMap<T> {
  map: Map<string, T> = new Map();
  inverseMap: Map<T, string> = new Map();
  add(value: T): string {
    if (this.inverseMap.has(value)) return this.inverseMap.get(value) as string;

    const uuid = crypto.randomUUID();
    this.map.set(uuid, value);
    this.inverseMap.set(value, uuid);
    return uuid;
  }
  get(key: string): T | undefined {
    return this.map.get(key);
  }
  list(): string[] {
    return Array.from(this.map.keys());
  }
}
