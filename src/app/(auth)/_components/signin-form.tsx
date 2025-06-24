"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../actions.ts"
import { useSearchParams } from "next/navigation";

export function SignInForm() {
  const searchParams = useSearchParams()
  const emailError = searchParams.get("email");
  const passwordError = searchParams.get("password");
  const error = searchParams.get("error")
  return (
    <form action={login} className="flex flex-col space-y-3">
      <span className="font-bold text-2xl">
        Sign in
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
      {(emailError || passwordError || error) && (
        <ul className="text-red-400 text-sm space-y-2">
          {emailError && (<li className="list-item">{emailError}</li>)}
          {passwordError && (<li>{passwordError}</li>)}
          {error && (<li>{error}</li>)}
        </ul>
      )}
      <Button type="submit" variant="secondary">
        Sign In
      </Button>
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
