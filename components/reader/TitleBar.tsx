export default function TitleBar(
  { title }: { title: string },
) {
  return (
    <div class="flex justify-center items-center p-4 border-b">
      <h1 class="text-3xl font-bold truncate">
        {title}
      </h1>
    </div>
  );
}
