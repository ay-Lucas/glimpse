import { getServerSupabase } from "@/services/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSupabase();
  const user = await session.auth.getUser();
  if (!session) {
    redirect("/signin");
  }
  return <div>{user.data.user?.email}</div>;
}
