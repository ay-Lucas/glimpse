import { SignUpForm } from "@/components/signup-form";
import Link from "next/link";
export default async function SignIn() {
  // const session = await auth();
  // if (!session) {
  //   console.log(session);
  // }
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800/75 px-14 py-8 rounded-lg shadow-2xl backdrop-blur">
      <div className="flex flex-col space-y-3">
        <SignUpForm />
        <span className="font-bold text-lg text-center">or</span>
        <Link href="/signin" className="text-center">
          Sign in
        </Link>
      </div>
    </div>
  );
}
