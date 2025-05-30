import { SearchMultiRequest, SearchMultiResponse } from "@/types/request-types-snakecase";
import { BASE_API_URL, options } from "@/lib/constants";
// import { makeCarouselCards } from "../discover/page";
import { Card } from "@/components/card";
import { makeCarouselCards } from "@/lib/utils";

const MAX_PAGES = 10;

async function getMultiSearch(
  request: SearchMultiRequest,
): Promise<SearchMultiResponse> {
  const res = await fetch(
    `${BASE_API_URL}/search/multi?query=${request.query}&include_adult=${request.include_adult}&language=${request.language}&page=${request.page}`,
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
  const items: any = filteredRes;

  return (
    <main>
      <div className="md:container pt-10">
        <div className="flex flex-wrap flex-shrink justify-center md:gap-8 gap-4">
          {filteredRes && filteredRes.length > 0 ? (
            makeCarouselCards(items)
          ) : (
            <div>No Results</div>
          )}
        </div>
      </div>
    </main>
  );
}
