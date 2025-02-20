import { IS_BROWSER } from "$fresh/runtime.ts";
import { Component, ComponentChildren, createRef } from "preact";
import PrefetchAnchor from "./PrefetchAnchor.tsx";

interface Props {
  href: string;
  "f-partial": string;
  children?: ComponentChildren;
}

export default class LoadButton extends Component<Props> {
  ref = createRef<HTMLAnchorElement>();
  observer: IntersectionObserver | null = null;

  override componentDidMount() {
    if (!IS_BROWSER) return;

    const currentRef = this.ref.current;
    if (!currentRef) return;

    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.length === 0 || !entries[0].isIntersecting) return;
      observer.disconnect();
      currentRef.click();
    }, {
      root: null,
      rootMargin: "1px",
      threshold: 0.2,
    });
    this.observer.observe(currentRef);
  }

  override componentDidUpdate() {
    this.componentWillUnmount();
    this.componentDidMount();
  }

  override componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  override render(props: Props) {
    if (!IS_BROWSER) {
      return (
        <div class="mt-6 text-center">
          <button
            href={props.href}
            class="text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
          >
            {props.children}
          </button>
        </div>
      );
    }
    return (
      <div class="mt-6 text-center">
        <PrefetchAnchor
          href={props.href}
          f-partial={props["f-partial"]}
          priority="low"
          class="text-xl px-12 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-slate-200 disabled:hidden text-white dark:text-black font-semibold rounded-lg shadow transition duration-300"
          f-ref={this.ref}
        >
          {props.children || "Load More"}
        </PrefetchAnchor>
      </div>
    );
  }
}
