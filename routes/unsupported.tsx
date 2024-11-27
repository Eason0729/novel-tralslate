import ErrorPage from "../components/ErrorPage.tsx";
import { domainList } from "../entity/crawler/mod.ts";

export default function Unsupported() {
  return (
    <ErrorPage code="400">
      <p class="text-muted-foreground text-left">
        Domain entered is not supported.
        <br />
        Following url are supported:
        <ul>
          {domainList.map((domain) => <li class="my-2">{domain}/*</li>)}
        </ul>
      </p>
    </ErrorPage>
  );
}
