import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopularTv,
  getTrendingTv,
  getPopularMovies,
  getTrendingMovies,
} from "@/app/browse/actions";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 300;
const MIN_POPULAR_POPULARITY = 8000;
export default async function Browse() {
  const [
    trendingTvRes,
    trendingMovieRes,
    popularTvRes,
    popularMoviesRes,
    upcomingMoviesRes,
  ] = await Promise.all([
    getTrendingTv("week"),
    getTrendingMovies("week"),
    getPopularTv(1, MIN_POPULAR_POPULARITY),
    getPopularMovies(1, MIN_POPULAR_POPULARITY),
    getUpcomingMovies(1),
  ]);
  const trendingTv = sortPopular(
    trendingTvRes.results,
    MIN_TRENDING_POPULARITY,
  );
  const trendingMovies = sortPopular(
    trendingMovieRes.results,
    MIN_TRENDING_POPULARITY,
  );
  const trendingTvAndMovies = trendingTvRes.results.concat(
    trendingMovieRes.results,
  );

  const trending = sortPopular(trendingTvAndMovies, MIN_TRENDING_POPULARITY);
  const isMobile = getDeviceType() === "mobile";
  const filteredPopularTv = popularTvRes.results.filter((item) =>
    isUnique(item, trending),
  );
  const filteredPopularMovie = popularMoviesRes.results.filter((item) =>
    isUnique(item, trending),
  );

  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden text-xl md:text-2xl font-bold">
        <h2 className={`md:pl-12 pl-10`}>Trending Series</h2>
        <ImageCarousel data={trendingTv} type="movie" isMobile={isMobile} />
        <h2 className={`md:pl-12 pl-10`}>Trending Movies</h2>
        <ImageCarousel data={trendingMovies} type="movie" isMobile={isMobile} />
        <h2 className={`md:pl-12 pl-10`}>Upcoming Movies</h2>
        <ImageCarousel
          data={upcomingMoviesRes.results}
          type="movie"
          isMobile={isMobile}
        />
        <h2 className={`md:pl-12 pl-10`}>Popular Series</h2>
        <ImageCarousel data={filteredPopularTv} type="tv" isMobile={isMobile} />
        <h2 className={`md:pl-12 pl-10`}>Popular Movies</h2>
        <ImageCarousel
          data={filteredPopularMovie}
          type="movie"
          isMobile={isMobile}
        />
      </div>
    </main>
  );
}
