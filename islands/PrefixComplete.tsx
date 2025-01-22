import { useRef } from "preact/hooks";
import { IconSearch } from "@tabler/icons-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Component } from "preact";
import { o } from "https://deno.land/x/dex@1.0.2/lib/deps/@jspm/core@1.1.0/nodelibs/chunk-0c2d1322.js";

interface Props {
  prefixs: string[];
  action?: string;
  placeholder?: string;
}
interface State {
  highlightIndex: number;
  matchPrefixs: string[];
  value: string;
}

export default class PrefixComplete extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      highlightIndex: -1,
      matchPrefixs: [],
      value: "",
    };
  }
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    this.setState({ value });
    if (value.length > 0) {
      console.log(
        this.props.prefixs.filter((prefix) => prefix.startsWith(value)),
      );
      this.setState({
        matchPrefixs: this.props.prefixs.filter((prefix) =>
          prefix.startsWith(value) && prefix.length > value.length
        ),
      });
    } else this.setState({ matchPrefixs: [] });
  }
  onSubmit(event: Event) {
    if (this.state.matchPrefixs.length > 0) {
      event.preventDefault();
    }
  }
  onSuggestionsClick(i: number) {
    this.setState({ value: this.state.matchPrefixs[i], matchPrefixs: [] });
  }
  override componentDidMount() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    globalThis.addEventListener("keyup", this.handleKeyDown);
  }

  override componentWillUnmount() {
    globalThis.removeEventListener("keyup", this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.state.matchPrefixs.length === 0) return;

    console.log(this.state.highlightIndex);
    if (event.key === "ArrowDown") {
      this.setState({
        highlightIndex: Math.min(
          this.state.highlightIndex + 1,
          this.state.matchPrefixs.length - 1,
        ),
      });
    } else if (event.key === "ArrowUp") {
      this.setState({
        highlightIndex: Math.max(this.state.highlightIndex - 1, 0),
      });
    } else if (event.key === "Enter") {
      if (this.state.highlightIndex >= 0) {
        this.onSuggestionsClick(this.state.highlightIndex);
      }
    } else if (event.key === "Escape") {
      this.setState({ matchPrefixs: [] });
    }
  }
  render({ action, placeholder }: Props) {
    const { matchPrefixs, highlightIndex } = this.state;
    return (
      <form
        class="flex gap-2 mb-4 text-lg relative"
        method="POST"
        action={action}
        autoComplete="off"
        onSubmit={this.onSubmit.bind(this)}
      >
        <input
          class="flex w-full rounded-md border border-input bg-background px-5 py-2 flex-grow h-12 dark:text-black peer/prefix-complete"
          placeholder={placeholder}
          type="text"
          name="url"
          value={this.state.value}
          onInput={this.onInput.bind(this)}
        />
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-slate-800 text-white dark:bg-slate-100 dark:text-black h-12 w-12"
          type="submit"
        >
          <IconSearch class="h-5 w-5" />
          <span class="sr-only">Search</span>
        </button>
        {matchPrefixs.length != 0 && (
          <ul class="hidden peer-focus-within/prefix-complete:block focus:block hover:block origin-top-right absolute z-10 border bg-slate-100 dark:text-black rounded-md shadow-lg mt-14 right-1 left-1 overflow-hidden max-h-[45vh]">
            {matchPrefixs.map((suggestion, i) => (
              <li
                key={suggestion}
                class={"px-4 py-2 cursor-pointer hover:bg-slate-300 border-y" +
                  (highlightIndex === i ? " bg-slate-200" : "")}
                onClick={() => this.onSuggestionsClick(i)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
    );
  }
}
