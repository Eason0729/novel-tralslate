function isRepeation(line: string): boolean {
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
    if (isRepeation) return true;
  }
  return false;
}

export default function Paragraph(
  props: { content: string; animation?: boolean },
) {
  return (
    <>
      <div class="timeline-view text-xl leading-relaxed">
        {props.content.split("\n").map((x) =>
          isRepeation(x.trim())
            ? <hr class="mx-1 my-12" />
            : (
              <p class="break-words">
                {x.trim()}
              </p>
            )
        )}
      </div>
    </>
  );
}
