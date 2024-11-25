export default function RandomBar(props: { times?: number }) {
  const times = props.times || 4;
  const sources = [
    <div class="flex my-5">
      <div class="h-3 mx-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div class="h-3 mx-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>,
    <div class="flex my-5">
      <div class="h-3 mx-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div class="h-3 mx-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>,
    <div class="flex my-5">
      <div class="h-3 mx-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div class="h-3 mx-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>,
    <div class="flex my-5">
      <div class="h-3 mx-2 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
      <div class="h-3 mx-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>,
    <div class="h-3 my-5 mx-2 bg-slate-200 dark:bg-slate-700 rounded" />,
  ];
  const list = [];
  for (let i = 0; i < times; i++) {
    list.push(sources[Math.floor(Math.random() * sources.length)]);
  }
  return (
    <div class="animate-pulse ">
      {list}
    </div>
  );
}
