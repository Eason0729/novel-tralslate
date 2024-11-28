type Direction = "left" | "right";

export default function ArrowButton(
  { direction, disabled }: { direction: Direction; disabled?: boolean },
) {
  return (
    <button
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium disabled:text-slate-400 h-10 px-4 py-2"
      disabled={disabled || false}
    >
      {direction == "left"
        ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-left h-4 w-4 mr-2"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        )
        : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-right h-4 w-4 ml-2"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        )}
      {direction == "left" ? "Previous" : "Next"}
    </button>
  );
}
