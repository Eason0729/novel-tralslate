import { Chat } from "ollama";
import { Semaphore } from "semaphore";
import * as OpenCC from "opencc";

const openccConverter = OpenCC.Converter({ from: "cn", to: "twp" });

const API_URL = Deno.env.get("API_URL") || "http://localhost:11434";
const MODEL = Deno.env.get("MODEL") ||
  "hf.co/SakuraLLM/Sakura-1.5B-Qwen2.5-v1.0-GGUF";
const parallel = new Semaphore(parseInt(Deno.env.get("PARALLEL")!) || 1);

const chunk_size = 618;

export default async function translate(text: string): Promise<string> {
  const release = await parallel.acquire();

  const chunks = [];
  while (text.length > chunk_size) {
    let i = chunk_size;
    while (text[i] !== "\n") {
      i--;
    }
    i = i === 0 ? chunk_size : i;
    chunks.push(text.substring(0, i));
    text = text.substring(i);
  }
  if (text.length != 0) chunks.push(text);

  const startTime = performance.now();

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
      API_URL,
      options: {
        num_ctx: chunk_size + 100,
        num_predict: Math.ceil(chunk.length * 1.25) + 100,
        temperature: 0.1,
        top_p: 0.3,
      },
    });
    res += chunkedRes + "\n";
  }

  console.debug(
    `translation of ${chunks.length} chunks has been done in ${
      performance.now() - startTime
    }ms`,
  );

  release();

  res = openccConverter(res);

  return res;
}
