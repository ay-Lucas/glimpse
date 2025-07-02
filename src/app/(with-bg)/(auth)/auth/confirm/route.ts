export const dynamic = "force-dynamic";

import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { redirect } from "next/navigation";
import { getServerSupabase } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await getServerSupabase();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }

    const msg = encodeURIComponent(error.message);
    console.log(error);
    redirect(`/signup?error=${msg}`);
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
