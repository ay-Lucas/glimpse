"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../actions.ts";
import { useSearchParams } from "next/navigation";

export function SignInForm() {
  const searchParams = useSearchParams();
  const emailError = searchParams.get("email");
  const passwordError = searchParams.get("password");
  const error = searchParams.get("error");
  return (
    <form action={login} className="flex flex-col space-y-3">
      <span className="text-2xl font-bold">Sign in</span>

      <Input
        required
        name="email"
        type="email"
        placeholder="Email"
        className="border-gray-500 bg-gray-600"
      />
      <Input
        required
        name="password"
        type="password"
        placeholder="Password"
        className="border-gray-500 bg-gray-600"
      />
      {(emailError || passwordError || error) && (
        <ul className="space-y-2 text-sm text-red-400">
          {emailError && <li className="list-item">{emailError}</li>}
          {passwordError && <li>{passwordError}</li>}
          {error && <li>{error}</li>}
        </ul>
      )}
      <Button type="submit" variant="default">
        Sign In
      </Button>
      <div className="border-b border-b-gray-500" />
    </form>
  );
}
