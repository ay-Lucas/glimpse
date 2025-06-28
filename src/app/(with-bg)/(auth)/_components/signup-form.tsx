"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "../actions.ts"
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

export function SignUpForm() {
  const { pending } = useFormStatus();
  const searchParams = useSearchParams()
  const emailError = searchParams.get("email");
  const passwordError = searchParams.get("password");
  const error = searchParams.get("error")
  console.log(emailError)
  console.log(passwordError)
  return (
    <div>
      {pending && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="loader">Loading…</div>
        </div>
      )}
      <form action={signup} className="flex flex-col space-y-3">
        <span className="font-bold text-2xl">Sign Up</span>
        <Input
          name="name"
          type="name"
          placeholder="Name"
          className="bg-gray-600 border-gray-500"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="bg-gray-600 border-gray-500"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="bg-gray-600 border-gray-500"
          required
        />
        {(emailError || passwordError || error) && (
          <ul className="text-red-400 text-sm space-y-2">
            {emailError && (<li className="list-item">{emailError}</li>)}
            {passwordError && (<li>{passwordError}</li>)}
            {error && (<li>{error}</li>)}
          </ul>
        )}
        <Button type="submit" variant="default">
          Sign Up
        </Button>
        <div className="border-b-gray-500 border-b" />
      </form>
    </div>
  );
}
