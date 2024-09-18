export default function Paragraph({ content }: { content: string }) {
  if (content == "") {
    return (
      <div class="animate-pulse">
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    );
  }
  return (
    <div class="text-xl leading-relaxed">
      {content.split("\n").map((x) => <p class="break-words">{x}</p>)}
    </div>
  );
}
