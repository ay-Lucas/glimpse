import Link from "next/link";

interface Props {
  searchParams: { message?: string };
}

export default function ErrorPage({ searchParams }: Props) {
  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : "An unexpected error occurred.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Oops!</h1>
      <p className="mb-6 text-center max-w-sm">{message}</p>
      <Link href="/signin">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Back to Sign In
        </button>
      </Link>
    </div>
  );
}
