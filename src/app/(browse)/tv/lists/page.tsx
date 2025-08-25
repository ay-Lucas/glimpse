import { getAllDiscoverTitles } from "@/lib/actions";
import { TrendingSeriesCarousel } from "../../discover/_components/discover-carousels";
import { getBlurDataMap } from "../../discover/_components/discover-utils";
import { fetchTmdbTvLists } from "../../discover/actions";
import {
  PopularSeriesCarousel,
  TopRatedTvCarousel,
  UpcomingTvCarousel,
  OnTheAirTvCarousel,
} from "../_components/carousels";
import {
  getOnTheAirTvList,
  getTopRatedTvList,
  getUpcomingTvList,
} from "../actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "TV Show Lists",
};

export default async function TvListPage() {
  const titles = await getAllDiscoverTitles(); // From supabase DB, entries backfilled from backfill.ts script
  const blurMap = await getBlurDataMap(titles); // Fetch LQIP blur data from redis and make into map

  const [{ popularTv, trendingTvDaily, trendingTvWeekly }] = await Promise.all([
    fetchTmdbTvLists(),
  ]);

  const [onTheAir, topRated, upcoming] = await Promise.all([
    getOnTheAirTvList(),
    getTopRatedTvList(),
    getUpcomingTvList(),
  ]);

  return (
    <>
      <h1 className="pb-4 text-start text-3xl font-bold">TV Lists</h1>
      <TrendingSeriesCarousel
        daily={trendingTvDaily}
        weekly={trendingTvWeekly}
        blurMap={blurMap}
      />
      <PopularSeriesCarousel tv={popularTv} blurMap={blurMap} />
      <TopRatedTvCarousel tv={topRated} />
      <UpcomingTvCarousel tv={upcoming} />
      <OnTheAirTvCarousel tv={onTheAir} />
    </>
  );
}
