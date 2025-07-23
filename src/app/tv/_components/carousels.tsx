import { mkCards } from "@/app/discover/_components/discover-utils";
import MediaCarousel from "@/components/media-carousel";
import TitleCarousel from "@/components/title-carousel";
import { BlurMap } from "@/types/redis";
import { TvResult } from "@/types/request-types-camelcase";

export async function PopularSeriesCarousel(data: {
  tv: TvResult[];
  blurMap: BlurMap;
}) {
  const popularTvCards = mkCards(data.tv, "tv", data.blurMap);

  return (
    <>
      <h2 className="text-2xl font-bold sm:pl-2">Popular</h2>
      <MediaCarousel items={popularTvCards} breakpointType="title" />
    </>
  );
}

export async function TopRatedTvCarousel(data: { tv: TvResult[] }) {
  const topRatedTvCards = mkCards(data.tv, "tv");

  return (
    <>
      <h2 className="text-2xl font-bold sm:pl-2">Top Rated</h2>
      <MediaCarousel items={topRatedTvCards} breakpointType="title" />
    </>
  );
}

export async function OnTheAirTvCarousel(data: { tv: TvResult[] }) {
  return (
    <>
      <h2 className="text-2xl font-bold sm:pl-2">On The Air</h2>
      <MediaCarousel items={mkCards(data.tv, "tv")} breakpointType="title" />
    </>
  );
}

export async function UpcomingTvCarousel(data: { tv: TvResult[] }) {
  return (
    <TitleCarousel
      title="Upcoming TV"
      titles={data.tv}
      breakpointType="title"
    />
  );
}

export async function ActionAndAdventureTvCarousel(data: { tv: TvResult[] }) {
  return (
    <TitleCarousel
      title="Action And Adventure"
      titles={data.tv}
      breakpointType="title"
    />
  );
}

export async function SciFiAndFantasyTvCarousel(data: { tv: TvResult[] }) {
  return (
    <TitleCarousel
      title="Sci-Fi & Fantasy"
      titles={data.tv}
      breakpointType="title"
    />
  );
}
