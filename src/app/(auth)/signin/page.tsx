import { Suspense } from "react";
import { SignInForm } from "../_components/signin-form";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col space-y-4 w-[375px] px-2">
        <div className="bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur px-8 sm:px-12 py-8">
          <div className="flex flex-col space-y-3">
            <Suspense>
              <SignInForm />
            </Suspense>
            <span className="font-bold text-lg text-center">or</span>
            <Link
              href="/signup"
              className="mx-auto hover:text-white text-gray-300"
            >
              Create an Account
            </Link>
          </div>
        </div>
        <div className="bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur px-8 sm:px-12 py-8">
          <div className="font-bold flex flex-col space-y-3 mb-2">
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
