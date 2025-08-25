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
  getTopRatedTvList,
  getUpcomingTvList,
  trendingTvByGenreSmart,
} from "./actions";
import { GENRES } from "@/lib/title-genres";
import TitleCarousel from "@/components/title-carousel";
import { getAllDiscoverTitles } from "@/lib/actions";
import { TrendingSeriesCarousel } from "../discover/_components/discover-carousels";
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
    crime,
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
    <>
      <ActionAndAdventureTvCarousel tv={actionAndAdventure} />
      <TitleCarousel title="Comedy" titles={comedy} breakpointType="title" />
      <SciFiAndFantasyTvCarousel tv={sciFiFantasy} />
      <TitleCarousel
        title="Crime"
        titles={crime}
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
    </>
  );
}
