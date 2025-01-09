import { Partial } from "$fresh/runtime.ts";
import LoadBotton from "../../islands/LoadButton.tsx";

export default function NovelLoad({ page, novelId }: {
  novelId: number;
  page: number;
}) {
  return (
    <Partial name="novel-load">
      <LoadBotton
        href={`/novel/${novelId}/${page + 1}`}
        f-partial={`/partial/novel/${novelId}/${page + 1}`}
      >
        Load More
      </LoadBotton>
    </Partial>
  );
}
