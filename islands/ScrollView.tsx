import { useEffect, useRef } from "preact/hooks";

export default function ArticlesList() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  });

  return <div ref={ref} />;
}
