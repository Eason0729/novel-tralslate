import { Language, Translator } from "./mod.ts";

export default class PlainTranslator implements Translator {
  disable = false;

  translate(
    contents: string[],
    _originLanguage: Language,
    _targetLanguage: Language,
  ): Promise<string[]> {
    return Promise.resolve(contents);
  }
}
