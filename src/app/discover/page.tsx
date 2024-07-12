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

  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trendingTvAndMovies),
  );
  const filteredPopularMovie = popularMoviesRes?.results?.filter(
    (item: MovieResult | TvResult) => isUnique(item, trendingTvAndMovies),
  );
  const userAgent = await getDeviceType();
  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-10 space-y-3 pt-5 overflow-hidden">
        <ImageCarousel
          data={trendingTv}
          type="tv"
          title="Trending Series"
          variant=""
          userAgent={userAgent}
        />
        <ImageCarousel
          data={trendingMovies}
          type="movie"
          title="Trending Movies"
          variant=""
        />
        <ImageCarousel
          data={upcomingMoviesRes.results!}
          type="movie"
          title="Upcoming Movies"
          variant=""
        />
        <ImageCarousel
          data={filteredPopularTv!}
          type="tv"
          title="Popular Series"
          variant=""
        />
        <ImageCarousel
          data={filteredPopularMovie!}
          type="movie"
          title="Popular Movies"
          variant=""
        />
      </div>
    </main>
  );
}
