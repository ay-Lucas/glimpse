import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopular,
  getTrending,
} from "@/app/discover/actions";
import { MovieResult, TvResult } from "@/types/request-types";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 300;
const VOTE_AVERAGE_GTE = 6;
export default async function Discover() {
  const [
    trendingTvRes,
    trendingMovieRes,
    popularTvRes,
    popularMoviesRes,
    upcomingMoviesRes,
  ] = await Promise.all([
    getTrending({ media_type: "tv", time_window: "day" }),
    getTrending({ media_type: "movie", time_window: "day" }),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "tv"),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "movie"),
    getUpcomingMovies({ page: 1 }),
  ]);
  const trendingTv = sortPopular(
    trendingTvRes.results!,
    MIN_TRENDING_POPULARITY,
  );
  const trendingMovies = sortPopular(
    trendingMovieRes.results!,
    MIN_TRENDING_POPULARITY,
  );
  const trendingTvAndMovies = trendingTvRes.results!.concat(
    trendingMovieRes.results!,
  );

  const trending = sortPopular(trendingTvAndMovies, MIN_TRENDING_POPULARITY);
  const isUserAgentMobile = (await getDeviceType()) === "mobile";
  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trending),
  );
  const filteredPopularMovie = popularMoviesRes?.results?.filter(
    (item: MovieResult | TvResult) => isUnique(item, trending),
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
