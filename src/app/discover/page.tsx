import { fetchTmdbMovieLists, fetchTmdbTvLists } from "@/app/discover/actions";
import { DiscoverSearch } from "./_components/discover-search";
import { getAllDiscoverTitles } from "@/lib/actions";
import {
  PopularMoviesAndSeriesCarousel,
  TrendingMoviesCarousel,
  TrendingSeriesCarousel,
  UpcomingMoviesCarousel,
} from "./_components/discover-carousels";
import { getBlurDataMap } from "./_components/discover-utils";
import { ToastListener } from "./_components/discover-toast-listener";
import { Suspense } from "react";

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
    <main className="mx-auto w-screen max-w-[1920px]">
      <Suspense>
        <ToastListener />
      </Suspense>
      <div className="space-y-3 overflow-hidden px-2 py-6 md:px-5 lg:px-10">
        <div className="mx-auto flex w-full flex-col space-y-3 px-1 pb-8">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            Discover Movies &amp; TV Shows
          </h1>
          <DiscoverSearch />
        </div>
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
      </div>
    </main>
  );
}
