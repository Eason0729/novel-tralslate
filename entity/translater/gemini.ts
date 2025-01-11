import { GoogleGenerativeAI } from "@google/generative-ai";
import * as def from "./mod.ts";

const MODEL = "gemini-1.5-flash";

const systemPrompt =
  "你是一個小說翻譯模型，可以流暢通順地以小說的風格將外文翻譯成繁體中文，並聯系上下文正確使用人稱代詞，不擅自添加原文中沒有的代詞，不要新增或擅自移除換行。";
const userPrefix = "將下面的外文文本翻譯成中文：";

export class Translater implements def.Translator {
  disable?: boolean | undefined;
  client?: GoogleGenerativeAI;
  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (apiKey) this.client = new GoogleGenerativeAI(apiKey);

    this.disable = apiKey ? false : true;
  }
  getAffinity(_: string): def.Affinity {
    return 1;
  }
  async translate(content: string): Promise<string> {
    const model = this.client?.getGenerativeModel({ model: MODEL })!;

    const res = await model.generateContent({
      systemInstruction: systemPrompt,
      contents: [
        {
          role: "user",
          parts: [{
            text: userPrefix + content,
          }],
        },
      ],
    });
    return res.response.text();
  }
}
