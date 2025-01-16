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
  const lines = props.content.split("\n");
  while (lines.length > 0 && lines[0].trim().length == 0) lines.shift();
  while (
    lines.length > 0 &&
    lines[lines.length - 1].trim().length == 0
  ) {
    lines.pop();
  }
  return (
    <div class="timeline-view text-xl leading-relaxed">
      {lines.map((x) => {
        const trimmed = x.trim();
        if (isRepeation(trimmed)) return <hr class="mx-1 my-12" />;
        if (trimmed.length == 0) return <br />;
        return <p class="break-words">{trimmed}</p>;
      })}
    </div>
  );
}
