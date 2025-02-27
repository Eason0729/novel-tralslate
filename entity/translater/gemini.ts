import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language, PartialRecord, Translator } from "./mod.ts";

const MODEL = "gemini-1.5-flash";

const systemPrompts: PartialRecord<Language, string> = {
  "zh-tw": [
    "請將以下外文小說翻譯成繁體中文。務必保留原文的意境和情感，同時確保譯文流暢自然。在翻譯過程中，請遵守以下要求：",
    "1. 尊重換行和特殊字元，確保格式不變。",
    "2. 維持人稱代名詞的使用，確保角色的聲音和特徵不被改變。",
  ].join("\n"),
  "zh-cn": [
    "请将以下外文小说翻译成简体中文。务必保留原文的意境和情感，同时确保译文流畅自然。在翻译过程中，请遵守以下要求：",
    "1. 尊重换行和特殊字符，确保格式不变。",
    "2. 维持人称代名词的使用，确保角色的声音和特征不被改变。",
  ].join("\n"),
  "en": [
    "Please translate the following foreign novel into English. Be sure to retain the original mood and emotion of the text, while ensuring that the translation is smooth and natural. During the translation process, please adhere to the following requirements:",
    "1. Respect line breaks and special characters, ensuring that the format remains unchanged.",
    "2. Maintain the use of personal pronouns, ensuring that the voice and characteristics of the characters are not altered.",
  ].join("\n"),
};

const userPrefix = "將下面的外文文本翻譯成中文：";

export default class GeminiTranslator implements Translator {
  disable?: boolean | undefined;
  client?: GoogleGenerativeAI;
  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (apiKey) this.client = new GoogleGenerativeAI(apiKey);

    this.disable = apiKey ? false : true;
  }
  async translate(
    contents: string[],
    _: Language,
    targetLanguage: Language,
  ): Promise<string[]> {
    const model = this.client?.getGenerativeModel({ model: MODEL })!;
    const results = await Promise.all(
      contents.map((content) =>
        model.generateContent({
          systemInstruction: systemPrompts[targetLanguage]!,
          contents: [
            {
              role: "user",
              parts: [{
                text: userPrefix + content,
              }],
            },
          ],
        })
      ),
    );
    return results.map((x) => x.response.text());
  }
}
