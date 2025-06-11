import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const maxDuration = 60; // default = 60, Vercel Hobby Plan limit is 60s

export async function POST(req: Request) {
  const { secret, paths } = await req.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }

  // `paths` should be an array of string URL paths, e.g. ["/tv/123", "/tv/123/seasons"]
  for (const path of paths as string[]) {
    // Trigger ISR revalidation for each path
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: paths });
}
