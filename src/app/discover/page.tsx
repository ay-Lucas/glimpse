import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getUpcomingMovies,
  getPopular,
  getTrending,
  getTrendingPages,
} from "@/app/discover/actions";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types";
import { Card } from "@/components/card";
import Link from "next/link";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 100;
const VOTE_AVERAGE_GTE = 6;
const NUMBER_OF_PAGES = 10;
const TRENDING_YEARS_OLD = 3;

export function makeCarouselCards(
  data: Array<TvResult | MovieResult | PersonResult>,
) {
  return data.map(
    (item: MovieResult | TvResult | PersonResult, index: number) => {
      let card: React.ReactNode;
      switch (item.media_type) {
        case "tv":
          card = (
            <Card
              title={item.name}
              overview={item.overview}
              imagePath={item.poster_path}
            />
          );
          break;
        case "movie":
          card = (
            <Card
              title={item.media_type}
              overview={item.overview}
              imagePath={item.poster_path}
            />
          );
          break;
        case "person":
          card = (
            <Card title={item.name} overview="" imagePath={item.profile_path} />
          );
          break;
      }
      return (
        <Link href={`/${item.media_type}/${item.id}`} key={index}>
          {card}
        </Link>
      );
    },
  );
}

export default async function Discover() {
  const [
    trendingTvRes,
    trendingMovieRes,
    popularTvRes,
    popularMoviesRes,
    upcomingMoviesRes,
  ] = await Promise.all([
    getTrendingPages(
      { media_type: "tv", time_window: "week", page: 1 },
      NUMBER_OF_PAGES,
    ),
    getTrendingPages(
      { media_type: "movie", time_window: "day", page: 1 },
      NUMBER_OF_PAGES,
    ),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "tv"),
    getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "movie"),
    getUpcomingMovies({ page: 1 }),
  ]);
  // const trendingTv = sortPopular(trendingTvRes, MIN_TRENDING_POPULARITY);
  const minDate = new Date().setFullYear(
    new Date().getFullYear() - TRENDING_YEARS_OLD,
  );
  const trendingTv = trendingTvRes.filter(
    (item) =>
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date((item as any).first_air_date).valueOf() > minDate,
  );
  const trendingMovies = trendingMovieRes.filter(
    (item) =>
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date((item as any).release_date).valueOf() > minDate,
  );
  const trendingTvAndMovies = trendingTv.concat(trendingMovies);
  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trendingTvAndMovies),
  );
  // Discover api endpoint doesn't return media type
  filteredPopularTv?.forEach((item) => (item.media_type = "tv"));
  const filteredPopularMovie = popularMoviesRes?.results?.filter(
    (item: MovieResult | TvResult) => isUnique(item, trendingTvAndMovies),
  );
  filteredPopularMovie?.forEach((item) => (item.media_type = "movie"));
  upcomingMoviesRes.results?.forEach((item) => (item.media_type = "movie"));

  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-0 lg:px-10 space-y-3 pt-5 overflow-hidden">
        <ImageCarousel
          items={makeCarouselCards(trendingTv)}
          title="Trending Series"
        />
        <ImageCarousel
          items={makeCarouselCards(trendingMovies)}
          title="Trending Movies"
        />
        <ImageCarousel
          items={makeCarouselCards(upcomingMoviesRes.results!)}
          title="Upcoming Movies"
        />
        <ImageCarousel
          items={makeCarouselCards(filteredPopularTv!)}
          title="Popular Series"
        />
        <ImageCarousel
          items={makeCarouselCards(filteredPopularMovie!)}
          title="Popular Movies"
        />
      </div>
    </main>
  );
}
