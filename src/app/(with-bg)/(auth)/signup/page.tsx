import { Suspense } from "react";
import { SignUpForm } from "../_components/signup-form";
import Link from "next/link";

export default async function SignUpPage() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col space-y-4 w-[375px] px-2">
        <div className="bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur px-8 sm:px-12 py-8">
          <div className="flex flex-col space-y-3">
            <Suspense>
              <SignUpForm />
            </Suspense>
            <span className="font-bold text-lg text-center">or</span>
            <Link
              href="/signin"
              className="text-center hover:text-white text-gray-300"
            >
              Sign in
            </Link>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
