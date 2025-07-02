export const dynamic = "force-static";

export default function TooManyRequests() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <h1 className="mb-4 text-6xl font-bold">429</h1>
      <p className="mb-8 text-xl">
        You’ve been rate limited. Please try again in a minute.
      </p>
      <a
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        ← Go Home
      </a>
    </div>
  );
}
