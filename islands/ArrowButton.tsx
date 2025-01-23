import { Ref, useRef } from "preact/hooks";
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-preact";
import { Component } from "preact";

type Direction = "left" | "right";

interface Props {
  direction: Direction;
  disabled?: boolean;
  href?: string;
}

export default class ArrowButton extends Component<Props> {
  ref?: Ref<HTMLButtonElement>;
  touchStart?: [number, number];
  constructor() {
    super();
  }
  override componentDidMount() {
    this.handleKeydown = this.handleKeydown.bind(this);
    globalThis.addEventListener("keydown", this.handleKeydown);

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    globalThis.addEventListener("touchstart", this.handleTouchStart);
    globalThis.addEventListener("touchend", this.handleTouchEnd);
  }
  override componentWillUnmount() {
    globalThis.removeEventListener("keydown", this.handleKeydown);

    globalThis.removeEventListener("touchstart", this.handleTouchStart);
    globalThis.removeEventListener("touchend", this.handleTouchEnd);
  }
  handleKeydown(event: KeyboardEvent) {
    if (this.props.disabled) return;
    if (this.props.direction == "left" && event.key == "a") {
      this.ref!.current?.click();
    } else if (this.props.direction == "right" && event.key == "d") {
      this.ref!.current?.click();
    }
  }
  handleTouchStart(event: TouchEvent) {
    this.touchStart = [event.touches[0].clientX, event.touches[0].clientY];
  }
  handleTouchEnd(event: TouchEvent) {
    const touchEnd = [
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY,
    ];
    if (this.touchStart) {
      const xDelta = touchEnd[0] - this.touchStart[0];
      const yDelta = touchEnd[1] - this.touchStart[1];
      if (Math.abs(xDelta) > Math.abs(yDelta)) {
        if (
          (xDelta < -40 && this.props.direction == "right") ||
          (xDelta > 40 && this.props.direction == "left")
        ) {
          this.ref!.current?.click();
        }
      }
    }
    this.touchStart = undefined;
  }
  render({ direction, disabled, href }: Props) {
    this.ref = useRef<HTMLButtonElement>(null);

    return (
      <nav>
        <a href={href} f-client-nav>
          <button
            class="min-w-36 inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium disabled:text-slate-400 h-10 px-4 py-2"
            disabled={disabled || false}
            ref={this.ref}
            tabIndex={-1}
          >
            {direction == "left"
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
              )}
          </button>
        </a>
      </nav>
    );
  }
}
