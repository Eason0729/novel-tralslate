import { GoogleGenerativeAI } from "@google/generative-ai";
import * as def from "./mod.ts";

const MODEL = "gemini-1.5-flash";

const systemPrompt = [
  "請將以下外文小說翻譯成繁體中文。務必保留原文的意境和情感，同時確保譯文流暢自然。在翻譯過程中，請遵守以下要求：",
  "1. 尊重換行和特殊字元，確保格式不變。",
  "2. 維持人稱代名詞的使用，確保角色的聲音和特徵不被改變。",
].join("\n");

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
