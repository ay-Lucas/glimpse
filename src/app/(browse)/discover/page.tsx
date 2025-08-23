import { getAllDiscoverTitles } from "@/lib/actions";
import {
  PopularMoviesAndSeriesCarousel,
  TrendingMoviesCarousel,
  TrendingSeriesCarousel,
  UpcomingMoviesCarousel,
} from "./_components/discover-carousels";
import { getBlurDataMap } from "./_components/discover-utils";
import { fetchTmdbTvLists, fetchTmdbMovieLists } from "./actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default async function DiscoverPage() {
  const titles = await getAllDiscoverTitles(); // From supabase DB, entries backfilled from backfill.ts script
  const blurMap = await getBlurDataMap(titles); // Fetch LQIP blur data from redis and make into map

  const [
    { trendingTvDaily, trendingTvWeekly, popularTv },
    {
      trendingMoviesDaily,
      trendingMoviesWeekly,
      popularMovies,
      upcomingMovies,
    },
  ] = await Promise.all([fetchTmdbTvLists(), fetchTmdbMovieLists()]);
  return (
    <>
      <h1 className="pb-4 text-start text-3xl font-bold">
        Discover Movies &amp; TV Shows
      </h1>
      <TrendingSeriesCarousel
        daily={trendingTvDaily}
        weekly={trendingTvWeekly}
        blurMap={blurMap}
      />
      <TrendingMoviesCarousel
        daily={trendingMoviesDaily}
        weekly={trendingMoviesWeekly}
        blurMap={blurMap}
      />
      <PopularMoviesAndSeriesCarousel
        tv={popularTv}
        movies={popularMovies}
        blurMap={blurMap}
      />
      <UpcomingMoviesCarousel movies={upcomingMovies} blurMap={blurMap} />
    </>
  );
}
