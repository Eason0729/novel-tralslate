import { Chat } from "ollama";
import * as OpenCC from "opencc";
import { currentLang, Language, Translator } from "./mod.ts";

const openccConverter = OpenCC.Converter({ from: "cn", to: "twp" });

const MODEL = "hf.co/SakuraLLM/Sakura-1.5B-Qwen2.5-v1.0-GGUF";

export default class SakuraTranslator implements Translator {
  disable = true;
  private apiURL?: string;
  private static ollamaWarningShown = false;
  private static showOllamaWarning() {
    if (!SakuraTranslator.ollamaWarningShown) {
      SakuraTranslator.ollamaWarningShown = true;
      console.warn(
        "Ollama API is disabled, despite the environment variable is set.",
      );
    }
  }

  private static chunkSize = 618;
  private static chunking(
    text: string,
  ): string[] {
    const chunks = [];
    while (text.length > SakuraTranslator.chunkSize) {
      let i = SakuraTranslator.chunkSize;
      while (i > 0 && text[i] !== "\n") i--;

      if (i == 0) i = SakuraTranslator.chunkSize;
      chunks.push(text.substring(0, i));
      text = text.substring(i);
    }
    if (text.length != 0) chunks.push(text);
    return chunks;
  }
  constructor() {
    const apiURL = Deno.env.get("OLLAMA_URL");
    this.apiURL = apiURL;

    if (!this.apiURL || !["zh-tw", "zh-cn"].includes(currentLang)) return;

    this.disable = false;

    setInterval(async () => {
      try {
        this.disable = await fetch(this.apiURL!, {
          signal: AbortSignal.timeout(1000),
        }).then((res) => !res.ok);
      } catch (_) {
        this.disable = true;
        SakuraTranslator.showOllamaWarning();
      }
    }, 30000);
  }

  async translateSingle(content: string, opencc: boolean) {
    const chunks = SakuraTranslator.chunking(content);

    let res = "";
    for (const chunk of chunks) {
      const chunkedRes = await Chat({
        messages: [
          {
            role: "system",
            content:
              "你是一个轻小说翻译模型，可以流畅通顺地以日本轻小说的风格将日文翻译成简体中文，并联系上下文正确使用人称代词，不擅自添加原文中没有的代词。",
          },
          {
            role: "user",
            content: "将下面的日文文本翻译成中文：" + chunk,
          },
        ],
        model: MODEL,
        API_URL: this.apiURL,
        options: {
          num_ctx: Math.floor(SakuraTranslator.chunkSize * 1.1 + 100),
          num_predict: Math.ceil(chunk.length * 1.25) + 100,
          temperature: 0.1,
          top_p: 0.3,
        },
      });
      res += chunkedRes;
    }

    if (opencc) {
      res = openccConverter(res);
    }

    return res;
  }

  async translate(
    contents: string[],
    _: Language,
    targetLanguage: Language,
  ): Promise<string[]> {
    const result = [];
    for (const content in contents) {
      result.push(
        await this.translateSingle(content, targetLanguage == "zh-tw"),
      );
    }
    return result;
  }
}
