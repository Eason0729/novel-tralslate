import { Partial } from "$fresh/runtime.ts";
import { Article, State as ArticleState } from "../../entity/article.ts";
import StartButton from "../../islands/StartButton.tsx";
import ScrollView from "../../islands/ScrollView.tsx";

function extractNumber(str: string): number[] {
  const digitPattern = /[０-９0-9〇一二三四五六七八九]+/g;

  const numberStrings = str.match(digitPattern) || [];

  const numbers = numberStrings.map((numStr) => {
    return parseInt(
      numStr.split("").map((char) => {
        switch (char) {
          case "〇":
            return "0";
          case "一":
            return "1";
          case "二":
            return "2";
          case "三":
            return "3";
          case "四":
            return "4";
          case "五":
            return "5";
          case "七":
            return "7";
          case "八":
            return "8";
          case "九":
            return "9";
        }

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

  const dp: number[] = new Array(sec.length).fill(1); // dp[i] will store the length of LIS ending at index i
  const previousIndex: number[] = new Array(sec.length).fill(-1); // to reconstruct the subsequence

  let maxLength = 1; // Tracks the overall maximum length of subsequence found
  let maxIndex = 0; // Tracks the index of the last element in the longest subsequence

  // Fill dp array with lengths of increasing subsequences
  for (let i = 1; i < sec.length; i++) {
    for (let j = 0; j < i; j++) {
      if (sec[i] > sec[j] && dp[i] < dp[j] + 1) {
        dp[i] = dp[j] + 1;
        previousIndex[i] = j; // update previous index for reconstruction
      }
    }
    // Update maxLength and maxIndex
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

export default function NovelList(
  { articles, focus }: { articles: Article[]; focus?: boolean },
) {
  articles.sort((a, b) => (a.index as number) - (b.index as number));

  const numberSeq = articles.flatMap((article) =>
    extractNumber(article.title as string)
  );
  const addIndex =
    longestIncreasingSubsequence(numberSeq).length * 1.5 < numberSeq.length;

  const list = articles.map((article, sec) => {
    let state;
    switch (article.state as ArticleState) {
      case "unfetch":
        state = "start";
        break;
      case "translating":
      case "fetching":
        state = "running";
        break;
      default:
        state = "retry";
    }
    const title = article.title as string;
    const index = article.index as number;
    return (
      <li
        key={`frag-novel-list-${index}`}
        class="block p-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black shadow transition duration-300"
      >
        {(sec === 0 && focus) && <ScrollView />}
        <div class="flex justify-between items-center tracking-tight text-2xl px-2 overflow-hidden">
          <a
            href={"/article/" + article.id}
            class="whitespace-nowrap overflow-x-hidden mr-3"
            f-client-nav={false}
          >
            {addIndex ? `第${index + 1}話 ${title.trim()}` : title.trim()}
          </a>
          <StartButton
            articleId={article.id as number}
            current={state}
          />
        </div>
      </li>
    );
  });

  return (
    <ul class="mt-4 space-y-3">
      <Partial name="novel-list" mode="append">
        {list}
      </Partial>
    </ul>
  );
}
// flex justify-between items-center font-semibold tracking-tight text-2xl mb-2
