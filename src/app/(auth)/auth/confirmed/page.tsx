import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Email Confirmed",
  description: "Your email has been confirmed — please log in.",
};

export default function EmailConfirmedPage() {
  return (
    <div className="w-full flex justify-center p-2">
      <div className="max-w-md bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur p-8 sm:px-12">
        <h1 className="text-3xl font-semibold mb-2">Email Confirmed 🎉</h1>
        <p className="mb-6 text-center text-gray-700">
          Your email address has been successfully verified. You can now log in to your account.
        </p>
        <Link href="/signin" passHref>
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    </div>
  );
}
