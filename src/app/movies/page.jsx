import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopularMovies,
  getTrendingMovies,
} from "@/app/browse/actions";
import { isUnique } from "@/lib/utils";

export default async function Movies() {
  const MIN_TRENDING_POPULARITY = 300;
  const MIN_POPULAR_POPULARITY = 8000;
  const [trendingMovieRes, popularMoviesRes, upcomingMoviesRes] =
    await Promise.all([
      getTrendingMovies("week"),
      getPopularMovies(1, MIN_POPULAR_POPULARITY),
      getUpcomingMovies(1),
    ]);
  const trendingMovies = sortPopular(
    trendingMovieRes.results,
    MIN_TRENDING_POPULARITY,
  );

  const isMobile = getDeviceType() === "mobile";

  const filteredPopularMovie = popularMoviesRes.results.filter((item) =>
    isUnique(item, trendingMovies),
  );

  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden">
        <ImageCarousel
          data={trendingMovies}
          type="movie"
          isMobile={isMobile}
          title="Trending"
        />
        <ImageCarousel
          data={filteredPopularMovie}
          type="movie"
          isMobile={isMobile}
          title="Popular"
        />
        <ImageCarousel
          data={upcomingMoviesRes.results}
          type="movie"
          isMobile={isMobile}
          title="Upcoming"
        />
      </div>
    </main>
  );
}
