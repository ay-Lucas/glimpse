"use server"

import { getBaseUrl } from '@/lib/utils';
import { getServerSupabase } from '@/services/supabase/server';
import { loginSchema } from '@/types/schema';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { toast } from 'sonner';

export async function resendConfirmation(formData: FormData) {
  const email = (formData.get("email") ?? formData.get("queryEmail")) as string;
  if (!email) {
    redirect("/signup");
  }

  const supabase = await getServerSupabase();
  const baseUrl = getBaseUrl();
  const { error } = await supabase.auth.resend({
    type: "signup",           // resend the signup confirmation link
    email,                     // the user's email address
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirmed`,
    },
  });

  if (error) {
    redirect(`/check-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function login(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
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
    if (error.code === "email_not_confirmed") {
      redirect(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
    }


    const msg = encodeURIComponent(error.message);
    redirect(`/signin?error=${msg}`);
  }

  if (!data.user.confirmed_at) {
    // nuke any session that might have been created
    await supabase.auth.signOut();
    // send them back to the “check your email” screen
    redirect(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/discover", "page");
  redirect("/discover?justSignedIn=1"); // Triggers sign in toast
}

export async function signup(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    // flatten fieldErrors into query params, e.g. ?email=...&password=...
    const { fieldErrors } = parsed.error.flatten();
    const params = new URLSearchParams();
    for (const [field, msgs] of Object.entries(fieldErrors)) {
      msgs?.forEach((m) => params.append(field, m));
    }
    console.log(params)
    // redirect back to your signup page with errors in the URL
    redirect(`/signup?${params.toString()}`);
  }

  const supabase = await getServerSupabase();
  const baseUrl = getBaseUrl();
  const { error } = await supabase.auth.signUp({
    email: parsed.data?.email!,
    password: parsed.data?.password!,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirmed`
    }
  })

  if (error) {
    // send the Supabase error back as a query-param too
    const msg = encodeURIComponent(error.message);
    redirect(`/signup?error=${msg}`);
  }
  revalidatePath('/', 'layout')
  revalidatePath('/check-email', 'page')
}
