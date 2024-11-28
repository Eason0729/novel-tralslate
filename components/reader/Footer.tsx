import ArrowButton from "./ArrowButton.tsx";

export default function Footer(
  { previousUrl, nextUrl }: { previousUrl?: string; nextUrl?: string },
) {
  return (
    <footer class="flex justify-between p-4 border-t">
      <a href={previousUrl || "#"}>
        <ArrowButton
          disabled={!previousUrl}
          direction="left"
        />
      </a>

      {nextUrl
        ? (
          <a href={nextUrl}>
            <ArrowButton direction="right" />
          </a>
        )
        : null}
    </footer>
  );
}
