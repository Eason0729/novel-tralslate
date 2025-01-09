export default function Alert({ msg }: { msg: string }) {
  return (
    <div class="bg-gray-100 dark:bg-gray-900 flex items-center justify-center h-screen p-3">
      <div class="w-full max-w-md bg-blue-100 dark:bg-gray-800 border-l-4 border-blue-500 dark:border-yellow-500 text-blue-700 dark:text-yellow-300 p-4 rounded shadow-md">
        <h2 class="font-bold text-lg">Warning!</h2>
        <p class="mt-2">{msg}</p>
        <div class="mt-4">
          <a
            href=""
            class="inline-flex items-center px-4 py-2 bg-blue-500 dark:bg-yellow-600 text-white font-semibold rounded hover:bg-blue-600 dark:hover:bg-yellow-700"
          >
            Reload
          </a>
          <a
            href="/"
            class="ml-2 inline-flex items-center px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded hover:bg-gray-600"
          >
            Back to home
          </a>
        </div>
        <meta http-equiv="refresh" content="10" />
      </div>
    </div>
  );
}
