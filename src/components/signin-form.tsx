import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/db/auth";
import Link from "next/link";

export async function SignInForm() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800/75 px-14 py-8 rounded-lg shadow-2xl backdrop-blur">
      <div className="flex flex-col space-y-3">
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="flex flex-col space-y-3"
        >
          <span className="font-bold text-2xl">Sign in</span>
          <Input
            type="username"
            placeholder="Username"
            className="bg-gray-600 border-gray-500"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-gray-600 border-gray-500"
          />
          <Button variant="secondary">Sign in</Button>
          <div className="border-b-gray-500 border-b" />
          <span className="font-bold text-lg text-center">or</span>
        </form>
        <Link href="/signup" className="mx-auto">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
