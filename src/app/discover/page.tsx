import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopular,
  getTrending,
  getTrendingPages,
} from "@/app/discover/actions";
import { MovieResult, TvResult } from "@/types/request-types";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 100;
const VOTE_AVERAGE_GTE = 6;
const NUMBER_OF_PAGES = 10;
const TRENDING_YEARS_OLD = 3;

export default async function Discover() {
  const [
    trendingTvRes,
    trendingMovieRes,
    popularTvRes,
    popularMoviesRes,
    upcomingMoviesRes,
  ] = await Promise.all([
    getTrendingPages(
      { media_type: "tv", time_window: "week", page: 1 },
      NUMBER_OF_PAGES,
    ),
    getTrendingPages(
      { media_type: "movie", time_window: "day", page: 1 },
      NUMBER_OF_PAGES,
    ),
    // getTrendingPages({ media_type: "movie", time_window: "week", page: 1 }),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "tv"),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "movie"),
    getUpcomingMovies({ page: 1 }),
  ]);
  // const trendingTv = sortPopular(trendingTvRes, MIN_TRENDING_POPULARITY);
  const minDate = new Date().setFullYear(
    new Date().getFullYear() - TRENDING_YEARS_OLD,
  );
  const trendingTv = trendingTvRes.filter(
    (item) =>
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date((item as any).first_air_date).valueOf() > minDate,
  );
  const trendingMovies = trendingMovieRes.filter(
    (item) =>
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date((item as any).release_date).valueOf() > minDate,
  );
  const trendingTvAndMovies = trendingTv.concat(trendingMovies);

  const isUserAgentMobile = (await getDeviceType()) === "mobile";
  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trendingTvAndMovies),
  );
  const filteredPopularMovie = popularMoviesRes?.results?.filter(
    (item: MovieResult | TvResult) => isUnique(item, trendingTvAndMovies),
  );
  return (
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>
          Trending Series
        </h2>
        <ImageCarousel
          data={trendingTv}
          type="tv"
          isUserAgentMobile={isUserAgentMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>
          Trending Movies
        </h2>
        <ImageCarousel
          data={trendingMovies}
          type="movie"
          isUserAgentMobile={isUserAgentMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>
          Upcoming Movies
        </h2>
        <ImageCarousel
          data={upcomingMoviesRes.results!}
          type="movie"
          isUserAgentMobile={isUserAgentMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Popular Series</h2>
        <ImageCarousel
          data={filteredPopularTv!}
          type="tv"
          isUserAgentMobile={isUserAgentMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Popular Movies</h2>
        <ImageCarousel
          data={filteredPopularMovie!}
          type="movie"
          isUserAgentMobile={isUserAgentMobile}
          variant=""
        />
      </div>
    </main>
  );
}
