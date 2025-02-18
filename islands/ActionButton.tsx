import {
  IconLanguageHiragana,
  IconLoader2,
  IconProgressDown,
} from "@tabler/icons-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

export default function ActionButton(
  props: { type: "reload" | "translate"; novelId: number },
) {
  const [disable, setDisable] = useState(false);

  let inner;
  let endpoint: string;
  if (props.type == "reload") {
    inner = (
      <>
        Translate All {disable
          ? <IconLoader2 class="h-8 w-8 ml-1 animate-spin" />
          : <IconLanguageHiragana class="h-8 w-8 ml-1" />}
      </>
    );
    endpoint = "/api/novel/translate/" + props.novelId;
  } else {
    inner = (
      <>
        Reload {disable
          ? <IconLoader2 class="h-8 w-8 ml-1 animate-spin" />
          : <IconProgressDown class="h-8 w-8 ml-1" />}
      </>
    );
    endpoint = "/api/novel/reload/" + props.novelId;
  }

  if (!IS_BROWSER) {
    return (
      <div>
        <form
          action={endpoint}
          method="POST"
        >
          <button
            type="submit"
            class="text-lg font-semibold items-center inline-flex p-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black shadow transition duration-300"
          >
            {inner}
          </button>
        </form>
      </div>
    );
  }

  function onClick() {
    setDisable(true);
    fetch(endpoint, {
      method: "post",
    }).then((res) => {
      if (res.ok) setDisable(false);
    });
  }

  return (
    <div>
      <button
        disabled={disable}
        onClick={onClick}
        class="text-lg font-semibold items-center inline-flex p-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 text-white dark:text-black shadow transition duration-300"
      >
        {inner}
      </button>
    </div>
  );
}
