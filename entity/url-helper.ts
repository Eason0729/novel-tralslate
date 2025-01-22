import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupportedSourceInfos, isUrlSupported } from "./crawler/mod.ts";

function getSystemPrompt() {
  const exampleUrls = getSupportedSourceInfos().map((source) =>
    source.exampleUrl
  );
  return `
You are a query tool assistant designed to help users with incorrectly formatted URLs. When users provide a URL that is not in the correct format, your task is to suggest properly formatted alternatives. Please follow these guidelines:

1. Generate only a many number of suggested URLs (ideally 7 to 10).
2. Clearly separate each suggested URL with a line break for easy readability.
3. Ensure that the suggested URLs are relevant and maintain the same structure as the original input.

For example, your response should look like this:
\`\`\`
${exampleUrls.join("\n")}
\`\`\`  

Your primary goal is to help users correct their URL inputs efficiently and accurately by providing a diverse range of valid suggestions, all formatted correctly.
`;
}

export async function fixUrl(url: string): Promise<string[]> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return [];

  const client = new GoogleGenerativeAI(apiKey);

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" })!;

  const res = await model.generateContent({
    systemInstruction: getSystemPrompt(),
    contents: [
      {
        role: "user",
        parts: [{
          text: url,
        }],
      },
    ],
  });

  return res.response.text().split("\n").filter((line) => isUrlSupported(line));
}
