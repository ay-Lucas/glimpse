import { ImageCarousel } from "@/components/image-carousel";
import {
  getUpcomingMovies,
  getPopular,
  getTrendingPages,
} from "@/app/discover/actions";
import { isUnique } from "@/lib/utils";
import { makeCarouselCards } from "../page";
import { MovieResult, TvResult } from "@/types/request-types";

const MIN_TRENDING_POPULARITY = 100;
const VOTE_AVERAGE_GTE = 6;
const NUMBER_OF_PAGES = 10;
const TRENDING_YEARS_OLD = 3;

export default async function Movies() {
  const [trendingMovieRes, popularMoviesRes, upcomingMoviesRes] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        NUMBER_OF_PAGES,
      ),
      getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "movie"),
      getUpcomingMovies({ page: 1 }),
    ]);
  const minDate = new Date().setFullYear(
    new Date().getFullYear() - TRENDING_YEARS_OLD,
  );
  const trendingMovies = trendingMovieRes.filter(
    (item) =>
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date((item as any).release_date).valueOf() > minDate,
  );
  // Discover api endpoint doesn't return media type
  const filteredPopularMovie = popularMoviesRes?.results?.filter(
    (item: MovieResult | TvResult) => isUnique(item, trendingMovies),
  );
  filteredPopularMovie?.forEach((item) => (item.media_type = "movie"));
  upcomingMoviesRes.results?.forEach((item) => (item.media_type = "movie"));

  return (
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <ImageCarousel
          items={makeCarouselCards(trendingMovies)}
          title="Trending Movies"
        />
        <ImageCarousel
          items={makeCarouselCards(upcomingMoviesRes.results!)}
          title="Upcoming Movies"
        />
        <ImageCarousel
          items={makeCarouselCards(filteredPopularMovie!)}
          title="Popular Movies"
        />
      </div>
    </main>
  );
}
