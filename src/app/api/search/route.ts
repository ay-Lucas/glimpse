// src/app/api/search/route.ts

import { searchAndRank, SearchMediaType } from "@/app/search/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1) grab all of the ?searchParams
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const mediaType = (searchParams.get("mediaType") || "all") as SearchMediaType;
  const includeAdult = searchParams.get("includeAdult") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // 2) parse your comma-separated array param
  const genreParam = searchParams.get("genreIds") || "";
  const genreIds = genreParam
    ? genreParam
        .split(",")
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n))
    : null;
  console.log(query, includeAdult, mediaType, genreIds, page);

  // 3) run your search
  const results = await searchAndRank(
    query,
    includeAdult,
    mediaType,
    genreIds,
    page
  );

  // 4) return JSON
  return NextResponse.json({ results });
}
