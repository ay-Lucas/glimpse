import { ImageCarousel } from "./_components/image-carousel";
import { options, shuffle, bubbleSort, sortPopular } from "@/lib/utils";
import { dateOptions } from "@/lib/constants";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopularTv,
  getTrendingTv,
  getPopularMovies,
  getTrendingMovies,
} from "./actions";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 300;
const MIN_POPULAR_POPULARITY = 8000;
export default async function HomePage() {
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
  function isUnique(item, array) {
    let unique = false;
    array.forEach((trendingItem) => {
      if (trendingItem.media_type === "tv" && trendingItem.name === item.name) {
        return (unique = true);
      } else if (
        trendingItem.media_type === "movie" &&
        trendingItem.title === item.title
      ) {
        return (unique = true);
      }
    });
    return !unique;
    // return item
  }
  const filteredPopularTv = popularTvRes.results.filter((item) =>
    isUnique(item, trending),
  );
  const filteredPopularMovie = popularMoviesRes.results.filter((item) =>
    isUnique(item, trending),
  );

  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden">
        <ImageCarousel
          data={trendingTv}
          type="movie"
          isMobile={isMobile}
          title="Trending Series"
        />
        <ImageCarousel
          data={trendingMovies}
          type="movie"
          isMobile={isMobile}
          title="Trending Movies"
        />
        <ImageCarousel
          data={upcomingMoviesRes.results}
          type="movie"
          isMobile={isMobile}
          title="Upcoming Movies"
        />
        <ImageCarousel
          data={filteredPopularTv}
          type="tv"
          isMobile={isMobile}
          title="Popular Series"
        />
        <ImageCarousel
          data={filteredPopularMovie}
          type="movie"
          isMobile={isMobile}
          title="Popular Movies"
        />
      </div>
    </main>
  );
}
