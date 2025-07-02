export const dynamic = "force-dynamic";

import Link from "next/link";

interface Props {
  searchParams: { message?: string };
}

export default function ErrorPage({ searchParams }: Props) {
  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center rounded-lg bg-gray-800/75 p-8 shadow-2xl backdrop-blur">
      <h1 className="mb-4 text-3xl font-bold text-red-600">Oops!</h1>
      <p className="mb-6 max-w-sm text-center">{message}</p>
      <Link href="/signin">
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Back to Sign In
        </button>
      </Link>
    </div>
  );
}
