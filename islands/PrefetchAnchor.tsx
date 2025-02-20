import { Component, ComponentChildren, JSX } from "preact";
import { PARTIAL_SEARCH_PARAM } from "$fresh/src/constants.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Ref } from "preact";

interface Props {
  href?: string;
  children?: ComponentChildren;
  priority?: RequestPriority;
  topScroll?: boolean;
  class?: string;
  "f-partial"?: string;
  "f-ref"?: Ref<HTMLAnchorElement>;
}

let index = 0;
if (IS_BROWSER) {
  if (history.state?.index) index = history.state?.index;
  if (!history.state) {
    const state = {
      index,
      scrollX,
      scrollY,
    };
    history.replaceState(state, document.title);
  }
}

function maybeUpdateHistory(nextUrl: URL) {
  if (nextUrl.href !== globalThis.location.href) {
    const state = {
      index,
      scrollX: globalThis.scrollX,
      scrollY: globalThis.scrollY,
    };

    history.replaceState({ ...state }, "", location.href);

    index++;
    state.scrollX = 0;
    state.scrollY = 0;
    history.pushState(state, "", nextUrl.href);
  }
}

export default class PrefetchAnchor
  extends Component<Props & JSX.HTMLAttributes<HTMLAnchorElement>> {
  res?: Response;
  abortController: AbortController = new AbortController();
  url: URL = new URL("", "http://example.com");
  constructor(props: Props & JSX.HTMLAttributes<HTMLAnchorElement>) {
    super(props);

    if (!IS_BROWSER) return;

    import("$fresh/src/runtime/entrypoints/main.ts");
  }
  override componentDidMount() {
    if (!this.props.href) return;
    if (!this.props["f-partial"]) this.props["f-partial"] = this.props.href;

    this.url = new URL(
      this.props["f-partial"] as string,
      globalThis.location.href,
    );
    this.url.searchParams.set(PARTIAL_SEARCH_PARAM, "true");

    if (this.props.priority == "high" || !PrefetchAnchor.slowConnection()) {
      fetch(this.url, {
        signal: this.abortController.signal,
        priority: this.props.priority,
        redirect: "follow",
      }).then(
        (res) => {
          this.res = res;
        },
      );
    }
  }
  override componentDidUpdate() {
    this.componentDidMount();
  }
  static slowConnection(): boolean {
    // deno-lint-ignore no-explicit-any
    const connection = (globalThis.navigator as any)?.connection;

    return connection
      ? (connection.saveData || /2g/.test(connection.effectiveType))
      : false;
  }
  async trigger(event: Event) {
    if (!this.props.href) return;

    event.preventDefault();

    let res = Promise.resolve(this.res);
    if (!this.res) {
      res = fetch(this.url, {
        signal: this.abortController.signal,
        redirect: "follow",
      });
    }

    try {
      const applyPartials =
        (await import("$fresh/src/runtime/entrypoints/main.ts")).applyPartials;
      await applyPartials(await res as Response);
      if (this.props.topScroll) scrollTo({ top: 0, behavior: "instant" });

      maybeUpdateHistory(new URL(this.props.href, globalThis.location.href));
    } catch (e) {
      console.warn(e);
    }
  }
  override render(props: Props & JSX.HTMLAttributes<HTMLAnchorElement>) {
    if (!IS_BROWSER) return <a {...props}>{props.children}</a>;

    return (
      <a ref={props["f-ref"]} onClick={this.trigger.bind(this)} {...props}>
        {props.children}
      </a>
    );
  }
}
