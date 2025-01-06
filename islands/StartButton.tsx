import { useSignal } from "@preact/signals";
import { IconLoader2, IconPlayerPlay, IconRefresh } from "@tabler/icons-preact";

type buttonState = "start" | "running" | "retry";
export default function StartButton(
  { articleId, current }: { articleId: number; current: string },
) {
  const state = useSignal(current as buttonState);

  const iconMap = {
    "start": <IconPlayerPlay />,
    "running": <IconLoader2 class="animate-spin" />,
    "retry": <IconRefresh />,
  };
  return (
    <>
      <noscript>
        <form method="post" action={`/api/article/${articleId}`}>
          <button type="submit">{iconMap[state.value]}</button>
        </form>
      </noscript>
      <button
        class="jsonly inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 !w-7"
        onClick={() => {
          fetch(`/api/article/${articleId}`, { method: "POST" }).then(() => {
            state.value = "retry";
          });
          state.value = "running";
        }}
        disabled={state.value == "running"}
      >
        {iconMap[state.value]}
      </button>
    </>
  );
}
