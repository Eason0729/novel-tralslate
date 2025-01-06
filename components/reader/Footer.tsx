import ArrowButton from "../../islands/ArrowButton.tsx";

export default function Footer(
  { previousUrl, nextUrl }: { previousUrl?: string; nextUrl?: string },
) {
  return (
    <footer class="flex justify-between p-4 border-t">
      <ArrowButton
        disabled={!previousUrl}
        direction="left"
        href={previousUrl}
      />

      {nextUrl ? <ArrowButton direction="right" href={nextUrl} /> : null}
    </footer>
  );
}
