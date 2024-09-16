import { useSignal } from "@preact/signals";

export function StartButton(
  { url, started }: { url: string; started: boolean },
) {
  const isPending = useSignal(started);
  return (
    <button
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 w-10"
      onClick={() => {
        fetch(url);
        isPending.value = true;
      }}
      disabled={isPending}
    >
      {isPending.value
        ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-pause h-4 w-4"
            data-id="13"
          >
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          </svg>
        )
        : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-play h-4 w-4"
          >
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        )}
    </button>
  );
}
