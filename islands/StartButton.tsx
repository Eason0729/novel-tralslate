import {
  IconInfoTriangle,
  IconLoader2,
  IconPlayerPlay,
  IconRefresh,
  IconTransform,
} from "@tabler/icons-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";
import { useState } from "preact/hooks";

const iconMap: {
  [key: string]: JSX.Element;
} = {
  error: <IconInfoTriangle />,
  translated: <IconRefresh />,
  fetched: <IconTransform />,
  unfetch: <IconPlayerPlay />,
};

export default function StartButton(
  props: { articleId: number; state: keyof typeof iconMap & string },
) {
  const [state, setState] = useState(props.state);

  const disabled = !iconMap[state];
  const icon = iconMap[state]
    ? iconMap[state]
    : <IconLoader2 class="animate-spin" />;

  const articleId = props.articleId;

  if (!IS_BROWSER) {
    return (
      <form
        method="post"
        action={`/api/article/${articleId}`}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 !w-7"
      >
        <button type="submit" disabled={disabled}>{icon}</button>
      </form>
    );
  }

  return (
    <button
      class="jsonly inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 h-10 !w-7"
      onClick={() => {
        fetch(`/api/article/${articleId}`, { method: "POST" });
        setState("running");
      }}
      disabled={disabled}
      aria-label="start translation"
      data-state={state}
    >
      {icon}
    </button>
  );
}
