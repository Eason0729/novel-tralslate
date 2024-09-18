export default function Paragraph({ content }: { content: string }) {
  return (
    <div class="text-xl leading-relaxed">
      {content.split("\n").map((x) => <p class="break-words">{x}</p>)}
    </div>
  );
}
