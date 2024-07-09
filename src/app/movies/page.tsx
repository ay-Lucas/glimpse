import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopular,
  getTrending,
} from "@/app/discover/actions";
import { isUnique } from "@/lib/utils";

export default async function Movies() {
  const MIN_TRENDING_POPULARITY = 300;
  const MIN_POPULAR_POPULARITY = 8000;
  const [trendingMovieRes, popularMoviesRes, upcomingMoviesRes] =
    await Promise.all([
      getTrending({ media_type: "movie", time_window: "day" }),
      getPopular(
        { page: 1, "vote_average.gte": MIN_POPULAR_POPULARITY },
        "movie",
      ),
      getUpcomingMovies({ page: 1 }),
    ]);
  const trendingMovies = sortPopular(
    trendingMovieRes.results!,
    MIN_TRENDING_POPULARITY,
  );

  const isMobile = (await getDeviceType()) === "mobile";

  const filteredPopularMovie = popularMoviesRes.results?.filter((item) =>
    isUnique(item, trendingMovies),
  );

  return (
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Trending</h2>
        <ImageCarousel
          data={trendingMovies}
          type="movie"
          isUserAgentMobile={isMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Popular</h2>
        <ImageCarousel
          data={filteredPopularMovie!}
          type="movie"
          isUserAgentMobile={isMobile}
          variant=""
        />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Upcoming</h2>
        <ImageCarousel
          data={upcomingMoviesRes.results!}
          type="movie"
          isUserAgentMobile={isMobile}
          variant=""
        />
      </div>
    </main>
  );
}
