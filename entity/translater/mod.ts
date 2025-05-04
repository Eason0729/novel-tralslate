import { Semaphore } from "semaphore";
import SakuraTranslator from "./sakura.ts";
import GeminiTranslator from "./gemini.ts";
import PlainTranslator from "./plain.ts";

export type Language = "zh-tw" | "zh-cn" | "en" | "jp" | "kr";
const AllowLanguagesList: string[] = ["zh-tw", "zh-cn", "en", "jp", "kr"];
export const currentLang = (Deno.env.get("TARGET_LANG") || "zh-tw") as Language;

console.log("Use environment variable TARGET_LANG to change language.");

if (!AllowLanguagesList.includes(currentLang)) {
  console.warn(`Invalid language: ${currentLang}`);
  console.warn(`Allow languages: ${AllowLanguagesList.join(", ")}`);
  Deno.exit(1);
}

// deno-lint-ignore no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface Translator {
  maxParallel?: number;
  disable?: boolean;
  translate(
    content: string[],
    originalLanguage: Language,
    targetLanguage: Language,
  ): Promise<string[]>;
}

export class RatelimitedTranslator implements Translator {
  inner: Translator;
  semaphore: Semaphore;
  constructor(inner: Translator) {
    this.inner = inner;
    this.semaphore = new Semaphore(inner.maxParallel || 4096);
  }
  get disable(): boolean | undefined {
    return this.inner.disable;
  }
  async translate(
    contents: string[],
    originalLanguage: Language,
    targetLanguage: Language,
  ): Promise<string[]> {
    const release = await this.semaphore.acquire();

    let translatedContents;
    try {
      translatedContents = await this.inner.translate(
        contents,
        originalLanguage,
        targetLanguage,
      );
    } finally {
      release();
    }

    return translatedContents;
  }
  get name(): string {
    return this.inner.constructor.name;
  }
}

export class TranslatorHandle {
  inner: Translator;
  originalLanguage: Language;
  targetLanguage: Language;

  constructor(
    inner: Translator,
    originalLanguage: Language,
    targetLanguage: Language,
  ) {
    this.inner = inner;
    this.originalLanguage = originalLanguage;
    this.targetLanguage = targetLanguage;
  }
  translate(contents: string[]): Promise<string[]> {
    return this.inner.translate(
      contents,
      this.originalLanguage,
      this.targetLanguage,
    );
  }
}

export function getTranslatorHandle(
  originalLanguage: Language,
): TranslatorHandle | undefined {
  const translators = Translators[`${originalLanguage}=>${currentLang}`] || [];

  const translator = translators.find((translator) => !translator.disable);
  if (translator) {
    return new TranslatorHandle(translator, originalLanguage, currentLang);
  }
}

function getHandle(): PartialRecord<
  `${Language}=>${Language}`,
  Translator[]
> {
  const plain = new PlainTranslator();
  const gemini = new RatelimitedTranslator(new GeminiTranslator());
  const sakura = new RatelimitedTranslator(new SakuraTranslator());
  return {
    "en=>en": [plain],
    "jp=>jp": [plain],
    "zh-cn=>zh-cn": [plain],
    "zh-tw=>zh-tw": [plain],
    "en=>zh-cn": [gemini],
    "en=>zh-tw": [gemini],
    "jp=>zh-tw": [sakura, gemini],
    "jp=>zh-cn": [sakura, gemini],
  };
}

const Translators: PartialRecord<
  `${Language}=>${Language}`,
  Translator[]
> = getHandle();
