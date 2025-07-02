import { Suspense } from "react";
import { SignInForm } from "../_components/signin-form";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[375px] flex-col space-y-4 px-2">
        <div className="rounded-lg bg-gray-800/75 px-8 py-8 shadow-2xl backdrop-blur sm:px-12">
          <div className="flex flex-col space-y-3">
            <Suspense>
              <SignInForm />
            </Suspense>
            <span className="text-center text-lg font-bold">or</span>
            <Link
              href="/signup"
              className="mx-auto text-gray-300 hover:text-white"
            >
              Create an Account
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800/75 px-8 py-8 shadow-2xl backdrop-blur sm:px-12">
          <div className="mb-2 flex flex-col space-y-3 font-bold">
            Demo Account
          </div>
          <div>
            Email:
            <span className="font-bold"> demo@lucasanderson.dev</span>
          </div>
          <div>
            Password:
            <span className="font-bold"> 12345678</span>
          </div>
        </div>
      </div>
    </div>
  );
}
