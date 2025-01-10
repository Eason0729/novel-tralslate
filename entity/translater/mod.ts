import { Semaphore } from "semaphore";
import { Translater as SakuraTranslater } from "./sakura.ts";
import { Translater as GeminiTranslater } from "./gemini.ts";

export type Affinity = number;

export interface Translator {
  maxParallel?: number;
  disable?: boolean;
  getAffinity(url: string): Affinity | undefined;
  translate(content: string): Promise<string>;
}

export class LimitTranslater implements Translator {
  inner: Translator;
  semaphore: Semaphore;
  constructor(inner: Translator) {
    this.inner = inner;
    this.semaphore = new Semaphore(inner.maxParallel || 4096);
  }
  get disable(): boolean | undefined {
    return this.inner.disable;
  }
  getAffinity(url: string): Affinity | undefined {
    return this.inner.getAffinity(url);
  }
  async translate(content: string): Promise<string> {
    const release = await this.semaphore.acquire();
    const res = await this.inner.translate(content);
    release();
    return res;
  }
}

const translators: Translator[] = [
  new SakuraTranslater(),
  new GeminiTranslater(),
].map((x) => new LimitTranslater(x));

export function getTranslator(url: string): Translator | undefined {
  let maxAffinity = 0;
  let translator: Translator | undefined;
  for (const t of translators) {
    const affinity = t.getAffinity(url);
    if (affinity && affinity > maxAffinity) {
      maxAffinity = affinity;
      translator = t;
    }
  }
  return translator;
}
