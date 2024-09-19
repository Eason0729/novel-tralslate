function randomBar(appearances: number = 4) {
  const list = [];
  for (let i = 0; i < appearances; i++) {
    switch (Math.floor(Math.random() * 5)) {
      case 0:
        list.push(
          <div class="h-3 my-5 mx-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />,
        );
        break;
      case 1:
        list.push(
          <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />,
        );
        break;
      case 2:
        list.push(
          <div class="h-3 my-5 mx-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />,
        );
        break;
      case 3:
        list.push(
          <div class="h-3 my-5 mx-2 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />,
        );
        break;
      default:
        list.push(
          <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />,
        );
    }
  }
  return (
    <div class="animate-pulse">
      {list}
    </div>
  );
}

export default function Paragraph(
  { content, endBar }: { content: string; endBar?: string },
) {
  if (content == "") return randomBar(8);

  return (
    <div
      class={"text-xl leading-relaxed" + (endBar ? " min-h-full" : "")}
    >
      {content.split("\n").map((x) => {
        const line = x.trimStart();
        for (
          let repeationLen = 1;
          line.length != 0 && repeationLen <= 3;
          repeationLen++
        ) {
          const repeation = line.substring(0, repeationLen);
          let isRepeation = true;
          for (let i = repeationLen; i < line.length; i++) {
            if (line[i] != repeation[i % repeationLen]) {
              isRepeation = false;
              break;
            }
          }
          if (isRepeation) return <hr class="mx-1 m-4" />;
        }
        return <p class="break-words">{x.trim()}</p>;
      })}
      {endBar ? randomBar() : undefined}
    </div>
  );
}
