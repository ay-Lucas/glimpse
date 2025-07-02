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
    <div className="pt-10 text-center">
      <h2 className="pb-4 text-xl">Something went wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
