"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "@/lib/actions";
import { useState } from "react";
import { redirect } from "next/navigation";

export function ErrorMessage({ data }: { data: FormData }) {
  return <div>{data.entries().toArray().toString()}</div>;
}

interface FieldErrors {
  email?: string[] | undefined;
  password?: string[] | undefined;
}
export function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState<String[]>();
  async function signUpAndRedirect(formData: FormData) {
    const res = await signup("credentials", formData); // Calls signin if successful
    if (!res?.errors) {
      redirect("/discover");
    } else {
      setErrorMessage([
        res.errors.email?.toString() ?? "",
        res.errors.password?.toString() ?? "",
      ]);
    }
  }

  return (
    <form action={signUpAndRedirect} className="flex flex-col space-y-3">
      <span className="font-bold text-2xl">Sign Up</span>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        className="bg-gray-600 border-gray-500"
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        className="bg-gray-600 border-gray-500"
      />
      {errorMessage && (
        <div className="text-red-400 text-sm">
          {errorMessage.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )}
      <Button type="submit" variant="secondary">
        Sign Up
      </Button>
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
