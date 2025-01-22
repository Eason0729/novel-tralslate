import { Partial } from "$fresh/runtime.ts";
import { Article } from "../../entity/article.ts";
import ArticleEntry from "./ArticleEntry.tsx";

function extractNumber(str: string): number[] {
  const digitPattern = /[０-９0-9〇一二三四五六七八九]+/g;

  const numberStrings = str.match(digitPattern) || [];

  const numbers = numberStrings.map((numStr) => {
    return parseInt(
      numStr.split("").map((char) => {
        const charsMap = {
          "〇": 0,
          "一": 1,
          "二": 2,
          "三": 3,
          "四": 4,
          "五": 5,
          "六": 6,
          "七": 7,
          "八": 8,
          "九": 9,
        };
        if (char in charsMap) return charsMap[char as keyof typeof charsMap];

        if (char >= "０" && char <= "９") {
          return (char.charCodeAt(0) - 0xFF10).toString();
        } else return char;
      }).join(""),
      10,
    );
  });

  return numbers;
}

function longestIncreasingSubsequence(sec: number[]): number[] {
  if (sec.length === 0) return [];

  const dp: number[] = new Array(sec.length).fill(1);
  const previousIndex: number[] = new Array(sec.length).fill(-1);

  let maxLength = 1;
  let maxIndex = 0;

  for (let i = 1; i < sec.length; i++) {
    for (let j = 0; j < i; j++) {
      if (sec[i] > sec[j] && dp[i] < dp[j] + 1) {
        dp[i] = dp[j] + 1;
        previousIndex[i] = j;
      }
    }

    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  const lis: number[] = [];
  while (maxIndex !== -1) {
    lis.push(sec[maxIndex]);
    maxIndex = previousIndex[maxIndex];
  }

  lis.reverse();

  return lis;
}

export default function ArticleList(
  { articles }: { articles: Article[] },
) {
  articles.sort((a, b) => (a.index as number) - (b.index as number));

  const addIndex = longestIncreasingSubsequence(
    articles.flatMap((article) =>
      extractNumber(article.untranslatedTitle as string)
    ),
  ).length < articles.length * 0.75;

  return (
    <ul class="mt-4 space-y-3">
      <Partial name="novel-list" mode="append">
        {articles.map((article) => (
          <ArticleEntry article={article} addIndex={addIndex} />
        ))}
      </Partial>
    </ul>
  );
}
