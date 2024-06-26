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

const MIN_POPULARITY = 200;
const MIN_TRENDING_POPULARITY = 100;

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
    getPopularTv(),
    getPopularMovies(),
    getUpcomingMovies(),
  ]);
  // const trendingTv = sortPopular(trendingTvRes.results, MIN_POPULARITY);
  // const trendingMovies = sortPopular(trendingMovieRes.results, MIN_POPULARITY);
  const trendingTvAndMovies = trendingTvRes.results.concat(
    trendingMovieRes.results,
  );

  const trending = sortPopular(trendingTvAndMovies, MIN_TRENDING_POPULARITY);
  const isMobile = getDeviceType() === "mobile";

  console.log(upcomingMoviesRes);
  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden">
        <ImageCarousel
          data={trending}
          variant="labeled"
          isMobile={isMobile}
          title="Trending"
        />
        {/* <ImageCarousel */}
        {/*   data={trendingTv} */}
        {/*   type="movie" */}
        {/*   isMobile={isMobile} */}
        {/*   title="TV Shows" */}
        {/* /> */}
        {/* <ImageCarousel */}
        {/*   data={trendingMovies} */}
        {/*   type="movie" */}
        {/*   isMobile={isMobile} */}
        {/*   title="Movies" */}
        {/* /> */}
        <ImageCarousel
          data={popularTvRes.results}
          type="tv"
          isMobile={isMobile}
          title="Popular Series"
        />

        <ImageCarousel
          data={popularMoviesRes.results}
          type="movie"
          isMobile={isMobile}
          title="Popular Movies"
        />

        <ImageCarousel
          data={upcomingMoviesRes.results}
          type="movie"
          isMobile={isMobile}
          title="Upcoming Movies"
        />
      </div>
    </main>
  );
}
