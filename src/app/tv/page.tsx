import { fetchTmdbTvLists } from "@/app/discover/actions";
import { getAllDiscoverTitles } from "@/lib/actions";
import { TrendingSeriesCarousel } from "../discover/_components/discover-carousels";
import { getBlurDataMap } from "../discover/_components/discover-utils";
import { ToastListener } from "../discover/_components/discover-toast-listener";
import { Suspense } from "react";
import {
  ActionAndAdventureTvCarousel,
  OnTheAirTvCarousel,
  PopularSeriesCarousel,
  SciFiAndFantasyTvCarousel,
  TopRatedTvCarousel,
  UpcomingTvCarousel,
} from "./_components/carousels";
import {
  getOnTheAirTvList,
  getSciFiFantasy,
  getTopRatedTvList,
  getUpcomingTvList,
  trendingTvByGenreSmart,
} from "./actions";
import { GENRES } from "@/lib/title-genres";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover TV Shows",
};

export default async function TvPage() {
  const titles = await getAllDiscoverTitles(); // From supabase DB, entries backfilled from backfill.ts script
  const blurMap = await getBlurDataMap(titles); // Fetch LQIP blur data from redis and make into map

  const [{ popularTv, trendingTvDaily, trendingTvWeekly }] = await Promise.all([
    fetchTmdbTvLists(),
  ]);

  const [onTheAir, topRated, upcoming, actionAndAdventure, sciFiFantasy] =
    await Promise.all([
      getOnTheAirTvList(),
      getTopRatedTvList(),
      getUpcomingTvList(),
      trendingTvByGenreSmart(GENRES.tv.ACTION_ADVENTURE, 4),
      getSciFiFantasy(3),
    ]);

  return (
    <main className="mx-auto w-screen max-w-[1920px]">
      <Suspense>
        <ToastListener />
      </Suspense>
      <div className="space-y-3 overflow-hidden px-1 sm:py-6 md:px-5 lg:px-10">
        <TopRatedTvCarousel tv={topRated} />
        <UpcomingTvCarousel tv={upcoming} />
        <ActionAndAdventureTvCarousel tv={actionAndAdventure} />
        <SciFiAndFantasyTvCarousel tv={sciFiFantasy} />
        <OnTheAirTvCarousel tv={onTheAir} />
        <PopularSeriesCarousel tv={popularTv} blurMap={blurMap} />
        <TrendingSeriesCarousel
          daily={trendingTvDaily}
          weekly={trendingTvWeekly}
          blurMap={blurMap}
        />
      </div>
    </main>
  );
}
