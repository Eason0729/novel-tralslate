import * as def from "./mod.ts";
import { Chat } from "ollama";
import * as OpenCC from "opencc";
import { assertEquals } from "$std/assert/assert_equals.ts";

const openccConverter = OpenCC.Converter({ from: "cn", to: "twp" });

const MODEL = "hf.co/SakuraLLM/Sakura-1.5B-Qwen2.5-v1.0-GGUF";

const defaultChunkSize = 618;

function chunking(
  text: string,
  chunkSize: number = defaultChunkSize,
): string[] {
  const chunks = [];
  while (text.length > chunkSize) {
    let i = chunkSize;
    while (i > 0 && text[i] !== "\n") i--;

    if (i == 0) i = chunkSize;
    chunks.push(text.substring(0, i));
    text = text.substring(i);
  }
  if (text.length != 0) chunks.push(text);
  return chunks;
}

let ollamaWarningShown = false;
export class Translater implements def.Translator {
  maxParallel = 1;
  disable;
  apiURL?: string;
  constructor() {
    const apiURL = Deno.env.get("OLLAMA_URL");
    this.apiURL = apiURL;

    this.disable = apiURL ? false : true;

    if (this.apiURL) {
      setInterval(async () => {
        try {
          this.disable = await fetch(this.apiURL!, {
            signal: AbortSignal.timeout(1000),
          }).then((res) => !res.ok);
        } catch (_) {
          this.disable = true;
          if (!ollamaWarningShown) {
            ollamaWarningShown = true;
            console.warn(
              "Ollama API is disabled, despite the environment variable is set.",
            );
          }
        }
      }, 30000);
    }
  }

  getAffinity(url: string): def.Affinity | undefined {
    const japaneseSource = [
      "https://www.alphapolis.co.jp",
      "https://kakuyomu.jp",
      "https://ncode.syosetu.com",
      "https://novel18.syosetu.com",
      "https://syosetu.org",
    ];
    if (japaneseSource.some((source) => url.startsWith(source))) {
      return 3;
    }
  }
  async translate(content: string): Promise<string> {
    const chunks = chunking(content);

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
          num_ctx: Math.floor(defaultChunkSize * 1.1 + 100),
          num_predict: Math.ceil(chunk.length * 1.25) + 100,
          temperature: 0.1,
          top_p: 0.3,
        },
      });
      res += chunkedRes;
    }

    res = openccConverter(res);

    return res;
  }
}

Deno.test("chunking", () => {
  const text =
    "This is a long string that exceeds the chunk size.\nIt has a newline within the first 50 characters.";
  const expected: string[] = [
    "This is a long string that exceeds the chunk size.",
    "\nIt has a newline within the first 50 characters.",
  ];
  const actual = chunking(text, 50);
  assertEquals(
    actual,
    expected,
    "Test Case 3 Failed: Long string, newline within limit",
  );
});
