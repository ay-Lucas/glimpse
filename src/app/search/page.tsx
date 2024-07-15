import {
  MovieResult,
  PersonResult,
  SearchMultiRequest,
  SearchMultiResponse,
  SearchRequest,
  TvResult,
} from "@/types/request-types";
import { baseApiUrl, options } from "@/lib/constants";
// import { useSearchParams } from "next/navigation";
import { Card } from "@/components/card";
import Link from "next/link";
import { NextRequest } from "next/server";

const MAX_PAGES = 10;
async function getMultiSearch(
  request: SearchMultiRequest,
): Promise<SearchMultiResponse> {
  const res = await fetch(
    `${baseApiUrl}/search/multi?query=${request.query}&include_adult=${request.include_adult}&language=${request.language}&page=${request.page}`,
    options,
  );
  return res.json();
}

async function getMultiSearchPages(
  request: SearchMultiRequest,
  response: SearchMultiResponse,
  maxNumber: number,
) {
  const requests = [];
  for (
    let i = 0;
    i < (maxNumber !== 0 ? maxNumber : response.total_pages);
    i++
  ) {
    requests.push(
      getMultiSearch({
        query: request.query,
        region: "en-US",
        include_adult: false,
        page: i + 1,
        language: "en-US",
        id: "",
      }),
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);
  return arrays;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string };
}) {
  if (searchParams === undefined || searchParams.query === "") throw Error;
  const params = {
    query: searchParams.query,
    region: "en-US",
    include_adult: false,
    page: 1,
    language: "en-US",
    id: "",
  };
  const res = await getMultiSearch(params);
  const allRes = await getMultiSearchPages(params, res, MAX_PAGES);
  const filteredRes = allRes.filter(
    (item: any) => item.poster_path || item.profile_path || item.backdrop_path,
  );
  return (
    <main>
      <div className="md:container pt-10">
        <div className="flex flex-wrap flex-shrink justify-center md:gap-8 gap-4">
          {filteredRes && filteredRes.length > 0 ? (
            filteredRes.map(
              (
                item: MovieResult | TvResult | PersonResult | undefined,
                i: number,
              ) => (
                <Link
                  key={i}
                  href={`/${item?.media_type}/${item?.id}`}
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
