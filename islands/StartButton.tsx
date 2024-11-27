import { useSignal } from "@preact/signals";

type buttonState = "start" | "running" | "retry";
export default function StartButton(
  { url, current }: { url: string; current: string },
) {
  const state = useSignal(current as buttonState);
  let icon;
  switch (state.value) {
    case "start":
      icon = (
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
        >
          <polygon points="6 3 20 12 6 21 6 3"></polygon>
        </svg>
      );
      break;
    case "running":
      icon = (
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
        >
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
        </svg>
      );
      break;
    case "retry":
      icon = (
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
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M8 16H3v5"></path>
        </svg>
      );
  }
  return (
    <button
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 w-10"
      onClick={() => {
        fetch(url, { method: "POST" }).then(() => {
          state.value = "retry";
        });
        state.value = "running";
      }}
      disabled={state.value == "running"}
    >
      {icon}
    </button>
  );
}
