import { useEffect, useRef } from "preact/hooks";
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-preact";

type Direction = "left" | "right";

export default function ArrowButton(
  { direction, disabled, href }: {
    direction: Direction;
    disabled?: boolean;
    href?: string;
  },
) {
  const ref = useRef<HTMLButtonElement>(null);

  const inner = direction == "left"
    ? (
      <>
        <IconChevronsLeft />
        Previous
      </>
    )
    : (
      <>
        Next
        <IconChevronsRight />
      </>
    );

  const keyEvent = (event: KeyboardEvent) => {
    if (disabled) return;
    if (direction == "left" && event.key == "a") {
      ref.current?.click();
    } else if (direction == "right" && event.key == "d") {
      ref.current?.click();
    }
  };
  useEffect(() => {
    globalThis.addEventListener("keydown", keyEvent);
  });
  return (
    <a href={href} f-client-nav>
      <button
        class="min-w-36 inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium disabled:text-slate-400 h-10 px-4 py-2"
        disabled={disabled || false}
        ref={ref}
        onKeyDown={keyEvent}
      >
        {inner}
      </button>
    </a>
  );
}
