import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Email Confirmed",
  description: "Your email has been confirmed — please log in.",
};

export default function EmailConfirmedPage() {
  return (
    <div className="flex w-full justify-center p-2">
      <div className="max-w-md rounded-lg bg-gray-800/75 p-8 shadow-2xl backdrop-blur sm:px-12">
        <h1 className="mb-2 text-3xl font-semibold">Email Confirmed 🎉</h1>
        <p className="mb-6 text-left text-gray-200">
          Your email address has been successfully verified. You can now log in
          to your account.
        </p>
        <Link href="/signin" passHref>
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    </div>
  );
}
