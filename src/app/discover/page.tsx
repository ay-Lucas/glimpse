import {
  fetchTmdbMovieLists,
  fetchTmdbTvLists,
} from "@/app/discover/actions";
import {
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { DiscoverSearch } from "./_components/discover-search";
import { getAllMovies, getAllTitles } from "@/lib/actions";
import { PopularMoviesAndSeriesCarousel, TrendingMoviesCarousel, TrendingSeriesCarousel, UpcomingMoviesCarousel } from "./_components/discover-carousels";

export const revalidate = 43200; // 12 hours
// export const dynamic = "force-dynamic";

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default async function DiscoverPage() {
  const backfilledDiscoverTitles = await getAllTitles();
  const blurDataMap = new Map<number, string>()

  backfilledDiscoverTitles.forEach(item => blurDataMap.set(item.tmdbId, item.posterBlurDataUrl ?? DEFAULT_BLUR_DATA_URL))

  const [{ trendingTvDaily, trendingTvWeekly, popularTv }, { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies }] = await Promise.all([fetchTmdbTvLists(), fetchTmdbMovieLists()])
  const backfilledMovies = await getAllMovies()
  console.log(backfilledMovies)
  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-2 md:px-5 lg:px-10 space-y-3 py-6 overflow-hidden">
        <div className="flex flex-col w-full pb-8 mx-auto space-y-3 px-1">
          <h1 className="text-xl sm:text-2xl text-center font-semibold">Discover Movies &amp; TV Shows</h1>
          <DiscoverSearch />
        </div>
        <TrendingSeriesCarousel daily={trendingTvDaily} weekly={trendingTvWeekly} blurMap={blurDataMap} />
        <TrendingMoviesCarousel daily={trendingMoviesDaily} weekly={trendingMoviesWeekly} blurMap={blurDataMap} />
        <PopularMoviesAndSeriesCarousel tv={popularTv} movies={popularMovies} blurMap={blurDataMap} />
        <UpcomingMoviesCarousel movies={upcomingMovies} blurMap={blurDataMap} />
      </div>
    </main >
  );
}
