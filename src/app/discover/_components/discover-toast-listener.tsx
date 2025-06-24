"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastListener() {
  const params = useSearchParams();
  const router = useRouter();
  const justSignedIn = params.get("justSignedIn");

  useEffect(() => {
    if (justSignedIn) {
      toast(
        "Welcome back!", {
        description: "You’ve successfully signed in.",
      });

      // remove the flag so it only fires once
      const newParams = new URLSearchParams([...params.entries()]);
      newParams.delete("justSignedIn");
      router.replace(`/discover?${newParams.toString()}`, { scroll: false });
    }
  }, [justSignedIn, params, router, toast]);

  return null;
}
