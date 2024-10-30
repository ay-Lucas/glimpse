"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signin } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

export function SignInButton() {
  const { pending, data, method, action } = useFormStatus();
  return (
    <Button type="submit" variant="secondary">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function SignInForm() {
  const pathname = usePathname();
  if (pathname == "/signin") console.log(pathname);
  return (
    <form
      action={async (formData) => {
        await signin("credentials", formData);
      }}
      className="flex flex-col space-y-3"
    >
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
      <SignInButton />
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
