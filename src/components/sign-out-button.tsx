"use client";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/context/supabase";
import { LogOut } from "lucide-react";
import { toast, Toaster } from "sonner";

export function SignOutButton() {
  const { client } = useSupabase();
  const router = useRouter();

  async function onSignOut() {
    const { error } = await client.auth.signOut();
    if (error) {
      toast("Sign out failed", {
        description: error.message
      });
    } else {
      toast(`Sign out successful`);
      router.push("/discover");
    }
  }

  return (
    <div>
      <button
        type="submit"
        className="flex px-2 py-1.5 w-full focus:bg-accent"
        onClick={onSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
