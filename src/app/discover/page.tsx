import {
  getTrendingSeries,
  getTrendingMovies,
  getPopularSeries,
  getPopularMovies,
  getUpcomingMovieSummaries,
  DiscoverItem,
  getTrendingPages,
  getPopular,
  getUpcomingMovies,
} from "@/app/discover/actions";
import { Card } from "@/components/card";
import Link from "next/link";
import {
  BaseImageUrl,
  DEFAULT_BLUR_DATA_URL,
  DISCOVER_LIMIT,
} from "@/lib/constants";
import ImageCarousel from "@/components/image-carousel";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import { getBlurData } from "@/lib/blur-data-generator";
import CarouselToggle from "../(media)/_components/carousel-toggle";

export const revalidate = 43200; // 12 hours

export default async function Discover() {
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

  const [trendingMovies, trendingTv, popularMovies, popularTv, upcoming] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        3, true
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        3, true
      ) as Promise<TvResult[]>,
      getPopular({ page: 1, "vote_average.gte": 6 }, "movie", true),
      getPopular({ page: 1, "vote_average.gte": 6 }, "tv", true),
      getUpcomingMovies({ page: 1 }, true),
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
        <CarouselToggle dailyItems={mkCards(await convertToDiscoverItems(trendingTv), "tv")} weeklyItems={mkCards(trendingTvItems, "tv")} title="Trending Series" />
        <CarouselToggle dailyItems={mkCards(await convertToDiscoverItems(trendingMovies), "movie")} weeklyItems={mkCards(trendingMovieItems, "tv")} title="Trending Movies" />
        <ImageCarousel
          items={mkCards(upcomingMovieItems, "movie")}
          titleString="Upcoming Movies"
        />
        <ImageCarousel
          items={mkCards(popularTvItems, "tv")}
          titleString="Popular Series"
        />
        <ImageCarousel
          items={mkCards(popularMovieItems, "movie")}
          titleString="Popular Movies"
        />
      </div>
    </main>
  );
}

async function convertToDiscoverItems(
  array: MovieResult[] | TvResult[]
): Promise<DiscoverItem[]> {

  const promises = array.map(async (item) => {
    const title = (item as MovieResult).title || (item as TvResult).name;
    const posterBlurDataUrl = item.posterPath
      ? await getBlurData(`${BaseImageUrl.BLUR}${item.posterPath}`)
      : DEFAULT_BLUR_DATA_URL;

    return {
      tmdbId: item.id,
      title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      posterBlurDataUrl,
      overview: item.overview,
    };
  });

  return await Promise.all(promises);
}
