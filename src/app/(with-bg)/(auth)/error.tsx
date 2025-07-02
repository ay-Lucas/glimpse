"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full justify-center p-2">
      <div className="max-w-md rounded-lg bg-gray-800/75 p-8 shadow-2xl backdrop-blur sm:px-12">
        <h2 className="pb-4 text-xl">Something went wrong signing you in!</h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
