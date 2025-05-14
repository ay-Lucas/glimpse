"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signin, signup } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export function Submit() {
  const { pending, data, method, action } = useFormStatus();
  console.log(pending);
  return (
    <Button type="submit" variant="secondary">
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
}

export function ErrorMessage({ data }: { data: FormData }) {
  return <div>{data.entries().toArray().toString()}</div>;
}

export async function SignUpForm() {
  return (
    <form
      action={async (formData) => {
        await signup("credentials", formData);
      }}
      className="flex flex-col space-y-3"
    >
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
      <Submit />
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
