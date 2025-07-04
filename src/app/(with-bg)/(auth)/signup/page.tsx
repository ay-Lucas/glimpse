import { Suspense } from "react";
import { SignUpForm } from "../_components/signup-form";
import Link from "next/link";

export default async function SignUpPage() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[375px] flex-col space-y-4 px-2">
        <div className="rounded-lg bg-gray-800/75 px-8 py-8 shadow-2xl backdrop-blur sm:px-12">
          <div className="flex flex-col space-y-3">
            <Suspense>
              <SignUpForm />
            </Suspense>
            <span className="text-center text-lg font-bold">or</span>
            <Link
              href="/signin"
              className="text-center text-gray-300 hover:text-white"
            >
              Sign in
            </Link>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
