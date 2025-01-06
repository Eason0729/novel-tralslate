export default function TitleBar(
  { title }: { title: string },
) {
  return (
    <div class="flex justify-between items-center p-4 border-b">
      <h1 class="text-3xl font-bold overflow-hidden whitespace-nowrap mr-3">
        {title}
      </h1>
    </div>
  );
}
