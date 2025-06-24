import { getServerSupabase } from "@/services/supabase/server";

export async function GET() {
  const session = await getServerSupabase();
  const user = await session.auth.getUser();
  if (!session) {
    return Response.json({ message: "unauthenticated" }, { status: 401 });
  }
  return Response.json({ name: user.data.user?.email });
}
