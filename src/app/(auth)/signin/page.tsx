import { SignInForm } from "../_components/signin-form";
import Link from "next/link";

export default async function SignIn() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800/75 px-14 py-8 rounded-lg shadow-2xl backdrop-blur">
        <div className="flex flex-col space-y-3">
          <SignInForm />
          <span className="font-bold text-lg text-center">or</span>
          <Link
            href="/signup"
            className="mx-auto hover:text-white text-gray-300"
          >
            Create an Account
          </Link>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800/75 px-14 py-8 rounded-lg shadow-2xl backdrop-blur mt-4">
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
    </>
  );
}
