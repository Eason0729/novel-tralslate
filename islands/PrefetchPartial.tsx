import { Component, ComponentChildren } from "preact";
import { PARTIAL_SEARCH_PARAM } from "$fresh/src/constants.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface Props {
  href?: string;
  children?: ComponentChildren;
  priority?: RequestPriority;
}

interface State {
  res?: Response;
  abortController: AbortController;
  url: URL;
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

export default class PrefetchPartial extends Component<Props, State> {
  applyPartials?: (res: Response) => Promise<void>;
  constructor(props: Props) {
    super(props);

    if (!IS_BROWSER) return;

    import("$fresh/src/runtime/entrypoints/main.ts");

    const abortController = new AbortController();
    if (!props.href) return;

    const url = new URL(props.href, globalThis.location.href);
    url.searchParams.set(PARTIAL_SEARCH_PARAM, "true");

    this.state = { abortController, url };

    if (props.priority == "high" || !PrefetchPartial.slowConnection()) {
      fetch(url, {
        signal: abortController.signal,
        priority: props.priority,
        redirect: "follow",
      }).then(
        (res) => {
          this.setState({ res });
        },
      );
    }
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

    let res = Promise.resolve(this.state.res);
    if (!this.state.res) {
      res = fetch(this.state.url, {
        signal: this.state.abortController.signal,
        redirect: "follow",
      });
    }

    try {
      const applyPartials =
        (await import("$fresh/src/runtime/entrypoints/main.ts")).applyPartials;
      await applyPartials(await res as Response);
      globalThis.window.scrollTo(0, 0);

      maybeUpdateHistory(new URL(this.props.href, globalThis.location.href));
    } catch (e) {
      console.warn(e);
    }
  }
  override render(props: Props) {
    if (!IS_BROWSER) return <a href={props.href}>{props.children}</a>;

    return (
      <a onClick={this.trigger.bind(this)} href={props.href}>
        {props.children}
      </a>
    );
  }
}
