import { Novel } from "../../entity/novel.ts";

export default function HistoryEntry(props: { novel: Novel }) {
  // const [hidden, setHidden] = useState(false);
  const novel = props.novel;
  const nameAvailable = novel.state == "translated" ||
    novel.name == "translating";

  return (
    <li class="flex items-center justify-between bg-slate-100 dark:text-black p-3 rounded text-lg">
      <a href={"/novel/" + novel.id} f-client-nav={false}>
        <span>
          {nameAvailable ? novel.name : `${novel.state}: ${novel.url}`}
        </span>
      </a>
      <form action={"/api/novel/" + novel.id} method="POST">
        <button
          type="submit"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium h-10 w-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x h-4 w-4"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span class="sr-only">Remove</span>
        </button>
      </form>
    </li>
  );
}
