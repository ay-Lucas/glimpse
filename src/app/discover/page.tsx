import { isUnique } from "@/lib/utils";
import {
  getUpcomingMovies,
  getPopular,
  getTrendingPages,
} from "@/app/discover/actions";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types";
import { Card } from "@/components/card";
import Link from "next/link";
import { BASE_POSTER_IMAGE_URL, BaseImageUrl } from "@/lib/constants";
import { appendBlurDataToMediaArray } from "@/lib/blur-data-generator";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 600;

const MIN_TRENDING_POPULARITY = 50;
const VOTE_AVERAGE_GTE = 6;
const NUMBER_OF_PAGES = 10;
const TRENDING_YEARS_OLD = 3;
const MIN_DATE = new Date().setFullYear(
  new Date().getFullYear() - TRENDING_YEARS_OLD,
);

const ImageCarouselClient = dynamic(
  () => import("@/components/image-carousel"),
  {
    ssr: true,
    loading: () => <Skeleton className="w-full h-[336px] rounded-xl" />,
  },
);
export async function makeCarouselCards(data: Array<TvResult | MovieResult>) {
  const posterPaths = data.map((item) => item.poster_path);

  const recsWithBlur = (await appendBlurDataToMediaArray(
    data,
    BaseImageUrl.BLUR,
    posterPaths,
  )) as Array<TvResult | MovieResult>;

  return recsWithBlur.map(
    (item: MovieResult | TvResult | PersonResult, index: number) => {
      let card: React.ReactNode;
      switch (item.media_type) {
        case "tv":
          card = (
            <Card
              title={item.name}
              overview={item.overview}
              imagePath={`${BASE_POSTER_IMAGE_URL}${item.poster_path}`}
              blurDataURL={(item as any).blurDataURL}
              loading="lazy"
            />
          );
          break;
        case "movie":
          card = (
            <Card
              title={item.title}
              overview={item.overview}
              imagePath={`${BASE_POSTER_IMAGE_URL}${item.poster_path}`}
              blurDataURL={(item as any).blurDataURL}
              loading="lazy"
            />
          );
          break;
        case "person":
          card = (
            <Card
              title={item.name}
              overview=""
              imagePath={`${BaseImageUrl.CAST}${item.profile_path}`}
              loading="lazy"
            />
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
      { media_type: "tv", time_window: "day", page: 1 },
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
  const trendingTv = trendingTvRes.filter(
    (item) =>
      item.media_type === "tv" &&
      item.original_language === "en" &&
      item.backdrop_path &&
      new Date(item.first_air_date ?? Date.now()).valueOf() > MIN_DATE,
  );
  const trendingMovies = trendingMovieRes.filter(
    (item) =>
      item.media_type === "movie" &&
      item.original_language === "en" &&
      (item.popularity ?? 0) > MIN_TRENDING_POPULARITY &&
      new Date(item.release_date ?? Date.now()).valueOf() > MIN_DATE &&
      new Date(item.release_date ?? Date.now()).valueOf() < Date.now(),
  );
  const trendingTvAndMovies = trendingTv.concat(trendingMovies);
  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trendingTvAndMovies),
  );
  // Discover api endpoint doesn't return media type
  filteredPopularTv?.forEach((item) => (item.media_type = "tv"));
  // const filteredPopularMovie = popularMoviesRes?.results?.filter(
  //   (item: MovieResult | TvResult) => isUnique(item, trendingTvAndMovies),
  // );
  const popularMovies = popularMoviesRes.results?.filter(
    (item) => (item.media_type = "movie"),
  );
  upcomingMoviesRes.results?.forEach((item) => (item.media_type = "movie"));

  const [
    trendingTvCards,
    trendingMovieCards,
    upcomingMovieCards,
    popularTvCards,
    popularMovieCards,
  ] = await Promise.all([
    makeCarouselCards(trendingTv),
    makeCarouselCards(trendingMovies),
    makeCarouselCards(upcomingMoviesRes.results!),
    makeCarouselCards(filteredPopularTv!),
    makeCarouselCards(popularMovies!),
  ]);

  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-0 lg:px-10 space-y-3 py-6 overflow-hidden">
        <ImageCarouselClient items={trendingTvCards} title="Trending Series" />
        <ImageCarouselClient
          items={trendingMovieCards}
          title="Trending Movies"
        />
        <ImageCarouselClient
          items={upcomingMovieCards}
          title="Upcoming Movies"
        />
        <ImageCarouselClient items={popularTvCards} title="Popular Series" />
        <ImageCarouselClient items={popularMovieCards} title="Popular Movies" />
      </div>
    </main>
  );
}
