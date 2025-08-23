import TitleCarousel from "@/components/title-carousel";
import { BlurMap } from "@/types/redis";
import { TvResult } from "@/types/request-types-camelcase";

export async function PopularSeriesCarousel(data: {
  tv: TvResult[];
  blurMap: BlurMap;
}) {
  return (
    <TitleCarousel title="Popular" titles={data.tv} breakpointType="title" />
  );
}

export async function TopRatedTvCarousel(data: { tv: TvResult[] }) {
  return (
    <TitleCarousel title="Top Rated" titles={data.tv} breakpointType="title" />
  );
}

export async function OnTheAirTvCarousel(data: { tv: TvResult[] }) {
  return (
    <TitleCarousel title="On The Air" titles={data.tv} breakpointType="title" />
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
