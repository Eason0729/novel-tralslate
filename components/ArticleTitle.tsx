export default function ArticleTitle(
  { title, index }: { title: string; index?: number },
) {
  index = index || 0;

  return (
    <>
      {(title as string).includes((index + 1).toString())
        ? undefined
        : `第${index + 1}話 `}
      {title}
    </>
  );
}
