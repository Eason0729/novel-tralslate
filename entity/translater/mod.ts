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

export class TranslaterHandle implements Translator {
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
  async translateMultiple(contents: string[]): Promise<string[]> {
    const release = await this.semaphore.acquire();

    const res = [];
    for (const content of contents) {
      res.push(await this.inner.translate(content));
    }

    release();

    return res;
  }
}

const translators: TranslaterHandle[] = [
  new SakuraTranslater(),
  new GeminiTranslater(),
].map((x) => new TranslaterHandle(x));

export function getTranslatorHandle(url: string): TranslaterHandle | undefined {
  let maxAffinity = 0;
  let translator: TranslaterHandle | undefined;
  for (const t of translators) {
    if (t.disable) continue;
    const affinity = t.getAffinity(url);
    if (affinity && affinity > maxAffinity) {
      maxAffinity = affinity;
      translator = t;
    }
  }
  return translator;
}
