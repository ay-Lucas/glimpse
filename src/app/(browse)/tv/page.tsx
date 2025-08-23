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
import TitleCarousel from "@/components/title-carousel";
import { getAllDiscoverTitles } from "@/lib/actions";
import { TrendingSeriesCarousel } from "../discover/_components/discover-carousels";
import { ToastListener } from "../discover/_components/discover-toast-listener";
import { getBlurDataMap } from "../discover/_components/discover-utils";
import { fetchTmdbTvLists } from "../discover/actions";

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

  const [
    onTheAir,
    topRated,
    upcoming,
    actionAndAdventure,
    sciFiFantasy,
    comedy,
    hentai,
  ] = await Promise.all([
    getOnTheAirTvList(),
    getTopRatedTvList(),
    getUpcomingTvList(),
    trendingTvByGenreSmart(GENRES.tv.ACTION_ADVENTURE, 5, 6, [], 50),
    trendingTvByGenreSmart(GENRES.tv.SCI_FI_FANTASY),
    trendingTvByGenreSmart(GENRES.tv.COMEDY),
    trendingTvByGenreSmart(GENRES.tv.CRIME),
    // getSciFiFantasy(3),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1920px]">
      <Suspense>
        <ToastListener />
      </Suspense>
      <div className="space-y-3 overflow-hidden px-1 sm:py-6 md:px-5 lg:px-10">
        <ActionAndAdventureTvCarousel tv={actionAndAdventure} />
        <TitleCarousel title="Comedy" titles={comedy} breakpointType="title" />
        <SciFiAndFantasyTvCarousel tv={sciFiFantasy} />
        <TitleCarousel
          title="Crime"
          titles={hentai}
          breakpointType="title"
          englishOnly={false}
        />
        <UpcomingTvCarousel tv={upcoming} />
        <OnTheAirTvCarousel tv={onTheAir} />
        <TrendingSeriesCarousel
          daily={trendingTvDaily}
          weekly={trendingTvWeekly}
          blurMap={blurMap}
        />
        <TopRatedTvCarousel tv={topRated} />
        <PopularSeriesCarousel tv={popularTv} blurMap={blurMap} />
      </div>
    </main>
  );
}
