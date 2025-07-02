"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "../actions.ts";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

export function SignUpForm() {
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const emailError = searchParams.get("email");
  const passwordError = searchParams.get("password");
  const error = searchParams.get("error");
  console.log(emailError);
  console.log(passwordError);
  return (
    <div>
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="loader">Loading…</div>
        </div>
      )}
      <form action={signup} className="flex flex-col space-y-3">
        <span className="text-2xl font-bold">Sign Up</span>
        <Input
          name="name"
          type="name"
          placeholder="Name"
          className="border-gray-500 bg-gray-600"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="border-gray-500 bg-gray-600"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="border-gray-500 bg-gray-600"
          required
        />
        {(emailError || passwordError || error) && (
          <ul className="space-y-2 text-sm text-red-400">
            {emailError && <li className="list-item">{emailError}</li>}
            {passwordError && <li>{passwordError}</li>}
            {error && <li>{error}</li>}
          </ul>
        )}
        <Button type="submit" variant="default">
          Sign Up
        </Button>
        <div className="border-b border-b-gray-500" />
      </form>
    </div>
  );
}
