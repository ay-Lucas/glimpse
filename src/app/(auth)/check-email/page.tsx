import { getServerSupabase } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import { resendConfirmation } from "../actions";
import { Button } from "@/components/ui/button";

export default async function CheckEmailPage({ searchParams }: { searchParams: { email?: string } }) {
  const { email } = searchParams;

  const supabase = await getServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (session || !email) {
    redirect("/discover");
  }

  return (
    <div className="p-2">
      <div className="flex flex-col max-w-md bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur p-8 space-y-3">
        <h1 className="text-2xl font-bold">Almost there!</h1>
        <p>
          We&apos;ve sent a confirmation link to <strong>{email}</strong>.
        </p>
        <p>Didn&apos;t get it?</p>
        <form action={resendConfirmation} className="inline">
          <input type="hidden" name="email" value={email} />
          <Button type="submit">
            Resend confirmation email
          </Button>
        </form>
      </div>
    </div>
  );
}
