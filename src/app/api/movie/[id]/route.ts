import { fetchMovieReleaseDates } from "@/app/(media)/actions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: number } }
) {
  const ratings = await fetchMovieReleaseDates(params.id);
  return NextResponse.json(ratings, { status: 200 });
}
