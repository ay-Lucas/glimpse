import {
  SearchMultiRequest,
  SearchMultiResponse,
  TvResult,
  MovieResult,
} from "@/types/request-types-snakecase";
import { BASE_API_URL, options } from "@/lib/constants";
// import { makeCarouselCards } from "../discover/page";
import { SlideCard } from "@/components/slide-card";

const MAX_PAGES = 10;

async function getMultiSearch(
  request: SearchMultiRequest
): Promise<SearchMultiResponse> {
  const res = await fetch(
    `${BASE_API_URL}/search/multi?query=${request.query}&include_adult=${request.include_adult}&language=${request.language}&page=${request.page}`,
    options
  );
  return res.json();
}

async function getMultiSearchPages(
  request: SearchMultiRequest,
  response: SearchMultiResponse,
  maxNumber: number
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
      })
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
    (item: any) => item.poster_path || item.profile_path || item.backdrop_path
  );

  return (
    <main>
      <div className="pt-10 md:container">
        <div className="flex flex-shrink flex-wrap justify-center gap-4 md:gap-8">
          {filteredRes && filteredRes.length > 0 ? (
            (filteredRes ?? []).map((item) => {
              const title =
                (item as MovieResult).title ?? (item as TvResult).name;
              const imagePath =
                item?.media_type !== "person"
                  ? item?.poster_path
                  : item.profile_path;
              const overview =
                item?.media_type !== "person" ? item?.overview : undefined;
              const tmdbVoteAverage =
                item?.media_type !== "person" ? item?.vote_average : undefined;
              const tmdbVoteCount =
                item?.media_type !== "person" ? item?.vote_count : undefined;
              return (
                <SlideCard
                  alt={`poster of ${title}`}
                  aspectClass="aspect-[2/3]"
                  tmdbId={item?.id!}
                  mediaType={item?.media_type!}
                  baseUrl="/tmdb/t/p/w500"
                  imagePath={imagePath}
                  title={title}
                  unoptimized
                  overview={overview}
                  tmdbVoteAverage={tmdbVoteAverage}
                  tmdbVoteCount={tmdbVoteCount}
                />
              );
            })
          ) : (
            <div>No Results</div>
          )}
        </div>
      </div>
    </main>
  );
}
