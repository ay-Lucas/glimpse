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
    <div className="w-full flex justify-center p-2">
      <div className="max-w-md bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur p-8 sm:px-12">
        <h2 className="text-xl pb-4">Something went wrong signing you in!</h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
