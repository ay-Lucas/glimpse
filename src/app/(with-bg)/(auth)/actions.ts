"use server";

import { getBaseUrl } from "@/lib/utils";
import { nanoid } from "nanoid";
import { getServerSupabase } from "@/services/supabase/server";
import { signinSchema, signupSchema } from "@/types/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

export async function resendConfirmation(formData: FormData) {
  const email = (formData.get("email") ?? formData.get("queryEmail")) as string;
  if (!email) {
    redirect("/signup");
  }

  const supabase = await getServerSupabase();
  const baseUrl = getBaseUrl();
  const { error } = await supabase.auth.resend({
    type: "signup", // resend the signup confirmation link
    email, // the user's email address
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirmed`,
    },
  });

  if (error) {
    redirect(
      `/check-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function login(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signinSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const params = new URLSearchParams();
    for (const [field, msgs] of Object.entries(fieldErrors)) {
      msgs?.forEach((msg) => params.append(field, msg));
    }
    // Field errors
    redirect(`/signin?${params.toString()}`);
  }

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error?.code === "email_not_confirmed") {
      console.log("email_not_confirmed");
      const { data: token, error } = await supabase
        .from("profiles")
        .select("email_verification_token")
        .eq("email", parsed.data.email)
        .single();
      // nuke any session that might have been created
      await supabase.auth.signOut();
      // send them back to the “check your email” screen
      redirect(
        `/check-email?email=${encodeURIComponent(parsed.data.email)}?token=${token}`
      );
    }

    const msg = encodeURIComponent(error.message);
    redirect(`/signin?error=${msg}`);
  }
  revalidatePath("/", "layout");
  revalidatePath("/discover", "page");
  redirect("/discover?justSignedIn=1"); // Triggers sign in toast
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function signup(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    // flatten fieldErrors into query params, e.g. ?email=...&password=...
    const { fieldErrors } = parsed.error.flatten();
    const params = new URLSearchParams();
    for (const [field, msgs] of Object.entries(fieldErrors)) {
      msgs?.forEach((m) => params.append(field, m));
    }
    // redirect back to your signup page with errors in the URL
    redirect(`/signup?${params.toString()}`);
  }

  const supabase = await getServerSupabase();
  const baseUrl = getBaseUrl();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data?.email!,
    password: parsed.data?.password!,
    options: {
      data: { name: parsed.data.name, email: parsed.data.email },
      emailRedirectTo: `${baseUrl}/auth/confirmed`,
    },
  });

  if (error) {
    // send the Supabase error back as a query-param too
    const msg = encodeURIComponent(error.message);
    redirect(`/signup?error=${msg}`);
  }

  const token = nanoid(32);
  const now = new Date().toISOString();
  const { data: upserted, error: upsertError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: data.user?.id,
        name: parsed.data.name,
        email: parsed.data.email,
        email_confirmation_sent_at: now,
        email_verification_token: token,
      },
      { onConflict: "id" } // ← single string, not an array
    );

  if (upsertError) {
    console.error("Could not upsert profile", upsertError);
    throw upsertError;
  }

  revalidatePath("/", "layout");
  revalidatePath("/check-email");
  console.log("redirecting to check-email");
  redirect(
    `/check-email?email=${encodeURIComponent(parsed.data.email)}&token=${token}`
  );
}
