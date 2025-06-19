import {
  fetchTmdbMovieLists,
  fetchTmdbTvLists,
} from "@/app/discover/actions";
import { DiscoverSearch } from "./_components/discover-search";
import { getAllTitles } from "@/lib/actions";
import { PopularMoviesAndSeriesCarousel, TrendingMoviesCarousel, TrendingSeriesCarousel, UpcomingMoviesCarousel } from "./_components/discover-carousels";
import { getBlurDataMap } from "./_components/discover-utils";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default async function DiscoverPage() {
  const titles = await getAllTitles(); // From supabase DB, entries backfilled from backfill.ts script
  const blurMap = await getBlurDataMap(titles); // Fetch LQIP blur data from redis and make into map


  const [{ trendingTvDaily, trendingTvWeekly, popularTv }, { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies }] = await Promise.all([fetchTmdbTvLists(), fetchTmdbMovieLists()])
  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-2 md:px-5 lg:px-10 space-y-3 py-6 overflow-hidden">
        <div className="flex flex-col w-full pb-8 mx-auto space-y-3 px-1">
          <h1 className="text-xl sm:text-2xl text-center font-semibold">Discover Movies &amp; TV Shows</h1>
          <DiscoverSearch />
        </div>
        <TrendingSeriesCarousel daily={trendingTvDaily} weekly={trendingTvWeekly} blurMap={blurMap} />
        <TrendingMoviesCarousel daily={trendingMoviesDaily} weekly={trendingMoviesWeekly} blurMap={blurMap} />
        <PopularMoviesAndSeriesCarousel tv={popularTv} movies={popularMovies} blurMap={blurMap} />
        <UpcomingMoviesCarousel movies={upcomingMovies} blurMap={blurMap} />
      </div>
    </main >
  );
}

