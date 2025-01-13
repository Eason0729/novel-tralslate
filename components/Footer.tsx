export default function Footer({ absolute = false }: { absolute?: boolean }) {
  const additionalClass = absolute
    ? " absolute bottom-0 left-0 right-0 w-full mb-4"
    : "";
  return (
    <footer
      class={"text-center text-xs sm:text-lg text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4" +
        additionalClass}
    >
      <div>
        Power by{" "}
        <a
          href="https://github.com/Eason0729/novel-tralslate"
          class="text-blue-500 dark:text-blue-400 font-semibold"
        >
          novel-translate
        </a>.
      </div>
    </footer>
  );
}
