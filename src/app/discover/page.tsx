import { isUnique } from "@/lib/utils";
import {
  getTrendingSeries,
  getTrendingMovies,
  getPopularSeries,
  getPopularMovies,
  getUpcomingMovieSummaries,
  DiscoverItem,
} from "@/app/discover/actions";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types-snakecase";
import { Card } from "@/components/card";
import Link from "next/link";
import {
  BASE_POSTER_IMAGE_URL,
  BaseImageUrl,
  DISCOVER_LIMIT,
} from "@/lib/constants";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 43200; // 12 hours

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

async function makeCarouselCards(data: Array<TvResult | MovieResult>) {

  return data.map(
    (item: MovieResult | TvResult | PersonResult, index: number) => {
      let card: React.ReactNode;
      switch (item.media_type) {
        case "tv":
          card = (
            <Card
              title={item.name}
              overview={item.overview}
              imagePath={`${BaseImageUrl.POSTER}${item.poster_path}`}
              // blurDataURL={(item as any).blurDataURL}
              loading="lazy"
            />
          );
          break;
        case "movie":
          card = (
            <Card
              title={item.title}
              overview={item.overview}
              imagePath={`${BaseImageUrl.POSTER}${item.poster_path}`}
              // blurDataURL={(item as any).blurDataURL}
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
  // const [
  //   trendingTvRes,
  //   trendingMovieRes,
  //   popularTvRes,
  //   popularMoviesRes,
  //   upcomingMoviesRes,
  // ] = await Promise.all([
  //   getTrendingPages(
  //     { media_type: "tv", time_window: "day", page: 1 },
  //     NUMBER_OF_PAGES,
  //   ),
  //   getTrendingPages(
  //     { media_type: "movie", time_window: "day", page: 1 },
  //     NUMBER_OF_PAGES,
  //   ),
  //   getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "tv"),
  //   getPopular({ page: 1, "vote_average.gte": VOTE_AVERAGE_GTE }, "movie"),
  //   getUpcomingMovies({ page: 1 }),
  // ]);
  const [
    trendingTvItems,
    trendingMovieItems,
    upcomingMovieItems,
    popularTvItems,
    popularMovieItems,
  ] = await Promise.all([
    getTrendingSeries(DISCOVER_LIMIT),
    getTrendingMovies(DISCOVER_LIMIT),
    getUpcomingMovieSummaries(DISCOVER_LIMIT),
    getPopularSeries(DISCOVER_LIMIT),
    getPopularMovies(DISCOVER_LIMIT),
  ]);

  const mkCards = (items: DiscoverItem[], mediaType: "tv" | "movie") =>
    items.map((item) => (
      <Link href={`/${mediaType}/${item.tmdbId}`} key={item.tmdbId}>
        <Card
          title={item.title}
          overview={item.overview}
          blurDataURL={item.posterBlurDataUrl}
          imagePath={`${BaseImageUrl.POSTER}${item.posterPath}`}
          loading="lazy"
        />
      </Link>
    ));

  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-0 lg:px-10 space-y-3 py-6 overflow-hidden">
        <ImageCarouselClient
          items={mkCards(trendingTvItems, "tv")}
          title="Trending Series"
        />
        <ImageCarouselClient
          items={mkCards(trendingMovieItems, "movie")}
          title="Trending Movies"
        />
        <ImageCarouselClient
          items={mkCards(upcomingMovieItems, "movie")}
          title="Upcoming Movies"
        />
        <ImageCarouselClient
          items={mkCards(popularTvItems, "tv")}
          title="Popular Series"
        />
        <ImageCarouselClient
          items={mkCards(popularMovieItems, "movie")}
          title="Popular Movies"
        />
      </div>
    </main>
  );
}
