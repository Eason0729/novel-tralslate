import { useSignal } from "@preact/signals";
import { IconLoader2, IconPlayerPlay, IconRefresh } from "@tabler/icons-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type buttonState = "start" | "running" | "retry";

export default function StartButton(
  props: { articleId: number; state: buttonState },
) {
  const state = useSignal(props.state as buttonState);

  const iconMap = {
    "start": <IconPlayerPlay />,
    "running": <IconLoader2 class="animate-spin" />,
    "retry": <IconRefresh />,
  };

  const articleId = props.articleId;

  if (!IS_BROWSER) {
    return (
      <form
        method="post"
        action={`/api/article/${articleId}`}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 !w-7"
        tabIndex={4}
      >
        <button type="submit">{iconMap[state.value]}</button>
      </form>
    );
  }

  return (
    <button
      class="jsonly inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 !w-7"
      onClick={() => {
        fetch(`/api/article/${articleId}`, { method: "POST" }).then(() => {
          state.value = "retry";
        });
        state.value = "running";
      }}
      disabled={state.value == "running"}
      aria-label="start translation"
      tabIndex={4}
    >
      {iconMap[state.value]}
    </button>
  );
}
