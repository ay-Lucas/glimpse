import {
  SearchMultiRequest,
  SearchMultiResponse,
} from "@/types/request-types-snakecase";
import { BASE_API_URL, options } from "@/lib/constants";
// import { makeCarouselCards } from "../discover/page";
import { SlideCard } from "@/components/slide-card";
import {
  PersonResult,
  TvResult,
  MovieResult,
} from "@/types/request-types-camelcase";
import { searchAndRank, SearchMediaType } from "./utils";
import { NSFW_GENRE_ID } from "@/lib/title-genres";

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
        region: "US",
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

function filterGenres(
  item: MovieResult | TvResult | PersonResult,
  includedGenreIds: number[] | null
) {
  // 1. no filter? keep everything
  if (!includedGenreIds || includedGenreIds?.length === 0) return true;

  // 2. only filter genres of movies & TV shows
  if (item.mediaType === "person") return false;

  // 3. guard against missing/empty genre_ids
  const ids: number[] = Array.isArray(item?.genreIds) ? item.genreIds : [];

  // 4. require at least one match
  return ids.some((g) => includedGenreIds?.includes(g));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query: string;
    page?: string;
    genreIds?: string;
    includeAdult?: boolean;
    mediaType?: SearchMediaType;
  };
}) {
  if (searchParams === undefined || searchParams.query === "") throw Error;

  const params = {
    query: searchParams.query,
    region: "en-US",
    genreIds: searchParams ? searchParams.genreIds?.split(",") : null,
    includeAdult: searchParams.includeAdult ?? false,
    mediaType: searchParams.mediaType ?? "titles",
    page: 1,
    language: "en-US",
    id: "",
  };

  // Process custom genres
  const rawGenreIds = params.genreIds?.map(Number) ?? null;

  if (rawGenreIds && rawGenreIds.find((id) => id === NSFW_GENRE_ID)) {
    params.includeAdult = true;
    params.genreIds = null; // reset genreIds, treat as if none
  }

  const genreIds = params.genreIds?.map(Number) ?? null;

  const res = await searchAndRank(
    params.query,
    params.includeAdult,
    params.mediaType
  );

  const results = res.filter((item) => filterGenres(item, genreIds));

  // const sorted = results.sort(
  //   (a, b) => (b?.popularity ?? 0) - (a?.popularity ?? 0)
  // );

  return (
    <main className="relative min-h-[75vh] md:min-h-[85vh]">
      <div className="px-2 pt-10 md:container">
        {/* <div className="flex flex-shrink flex-wrap justify-start gap-4 md:gap-8"> */}
        {results && results.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 xxs:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-5 xl:grid-cols-6">
            {(results ?? []).map((item) => {
              const title =
                (item as TvResult).name ||
                (item as MovieResult).title ||
                (item as PersonResult).name;
              const imagePath =
                item?.mediaType !== "person"
                  ? item?.posterPath
                  : item.profilePath;
              const overview =
                item?.mediaType !== "person" ? item?.overview : undefined;
              const tmdbVoteAverage =
                item?.mediaType !== "person" ? item?.voteAverage : undefined;
              const tmdbVoteCount =
                item?.mediaType !== "person" ? item?.voteCount : undefined;
              return (
                <SlideCard
                  key={item?.id!}
                  alt={`poster of ${title}`}
                  aspectClass="aspect-[2/3]"
                  tmdbId={item?.id!}
                  mediaType={item.mediaType!}
                  baseUrl="/tmdb/t/p/w500"
                  imagePath={imagePath}
                  title={title}
                  unoptimized
                  overview={overview}
                  tmdbVoteAverage={tmdbVoteAverage}
                  tmdbVoteCount={tmdbVoteCount}
                  isAdult={item.adult}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-2xl">No Results</div>
        )}
      </div>
    </main>
  );
}
