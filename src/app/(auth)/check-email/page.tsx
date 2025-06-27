import { getServerSupabase } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import { resendConfirmation } from "../actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export default async function CheckEmailPage({ searchParams }: { searchParams: { email?: string, token?: string } }) {
  const { email, token } = searchParams;

  const supabase = await getServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  // const { data: { user } } = await supabase.auth.getUser()

  if (!email && !token) {
    redirect("/discover");
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("email_confirmation_sent_at")
    .eq("email_verification_token", token)
    .single()

  if (error || !profile) throw error ?? new Error('Profile not found')

  // 3) compute elapsed minutes
  const sentAt = profile.email_confirmation_sent_at
    ? new Date(profile.email_confirmation_sent_at).getTime()
    : 0
  const minutesAgo = Math.floor((Date.now() - sentAt) / 1000 / 60)
  // 4) determine throttle (e.g. 15min cooldown)
  const COOLDOWN_MINUTES = 15
  const canResend = minutesAgo >= COOLDOWN_MINUTES
  return (
    <div className="p-2">
      <div className="flex flex-col max-w-md bg-gray-800/75 rounded-lg shadow-2xl backdrop-blur p-8 space-y-3">

        <h1 className="text-2xl font-bold">Check your email</h1>
        <p>
          We just sent a confirmation link to <br /><strong>{email}</strong>.
        </p>
        <p className="text-sm text-gray-500">
          It was sent {minutesAgo === 0 ? 'just now' : `${minutesAgo} minute(s) ago`}.
        </p>

        {canResend ? (
          <form action={resendConfirmation} className="space-y-2">
            <input type="hidden" name="email" value={email} />
            <Button type="submit">
              Resend link
            </Button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">
            You can request a new link in{' '}
            {COOLDOWN_MINUTES - minutesAgo} minute(s).
          </p>
        )}
      </div>
    </div>
  );
}
