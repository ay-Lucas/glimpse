"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signin } from "@/lib/actions";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const [error, setError] = useState(false);
  const pathname = usePathname();

  async function signInAndRedirect(formData: FormData) {
    const res = await signin("credentials", formData);
    if (!res?.errors) {
      redirect("/discover");
    } else {
      setError(true);
    }
  }

  return (
    <form action={signInAndRedirect} className="flex flex-col space-y-3">
      <span className="font-bold text-2xl">
        {pathname === "/signin" ? "Sign in" : "Sign up"}
      </span>
      <Input
        required
        name="email"
        type="email"
        placeholder="Email"
        className="bg-gray-600 border-gray-500"
      />
      <Input
        required
        name="password"
        type="password"
        placeholder="Password"
        className="bg-gray-600 border-gray-500"
      />
      {error && (
        <p className="text-red-400 text-sm">
          The email and/or password you specified are not correct.
        </p>
      )}
      <Button type="submit" variant="secondary">
        Sign In
      </Button>
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
