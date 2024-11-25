import { IS_BROWSER } from "$fresh/runtime.ts";

export function OpacityEnter() {
  if (!IS_BROWSER) return <></>;
  const elements = document.querySelectorAll(".opacity-enter");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-enter-active");
      }
    });
  });
  elements.forEach((element) => {
    observer.observe(element);
  });

  return <></>;
}
