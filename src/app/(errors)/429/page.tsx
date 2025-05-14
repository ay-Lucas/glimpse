export const dynamic = "force-static";

export default function TooManyRequests() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-6xl font-bold mb-4">429</h1>
      <p className="text-xl mb-8">
        You’ve been rate limited. Please try again in a minute.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        ← Go Home
      </a>
    </div>
  );
}
