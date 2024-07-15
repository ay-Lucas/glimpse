import {
  MovieResult,
  PersonResult,
  SearchMultiRequest,
  SearchMultiResponse,
  TvResult,
} from "@/types/request-types";
import { baseApiUrl, options } from "@/lib/constants";
// import { useSearchParams } from "next/navigation";
import { Card } from "@/components/card";
import Link from "next/link";
import { NextRequest } from "next/server";

export async function getMultiSearch(
  request: SearchMultiRequest,
): Promise<SearchMultiResponse> {
  const res = await fetch(
    `${baseApiUrl}/search/multi?query=${request.query}&include_adult=${request.include_adult}&language=${request.language}&page=${request.page}`,
    options,
  );
  return res.json();
}
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string };
}) {
  if (searchParams === undefined || searchParams.query === "") throw Error;
  console.log(searchParams?.query);
  const res = await getMultiSearch({
    query: searchParams.query,
    region: "en-US",
    include_adult: false,
    page: 1,
    language: "en-US",
    id: "",
  });
  console.log(res);
  return (
    <main>
      <div className="container pt-10">
        <div className="flex flex-wrap justify-center gap-8">
          {res.results && res.results.length > 0 ? (
            res.results?.map(
              (item: MovieResult | TvResult | PersonResult, i: number) => (
                <Link
                  key={i}
                  href={`/${item.media_type}/${item.id}`}
                  className="group z-0"
                >
                  <Card data={item} index={i} loading="lazy" />
                </Link>
              ),
            )
          ) : (
            <div>No Results</div>
          )}
        </div>
      </div>
    </main>
  );
}
