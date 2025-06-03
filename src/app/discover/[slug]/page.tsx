export const runtime = 'nodejs';
import {
  DiscoverItem,
  getTrendingPages,
  getUpcomingMovies,
  getPopularPages,
} from "@/app/discover/[slug]/actions";
import { Card } from "@/components/card";
import Link from "next/link";
import {
  BaseImageUrl,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import ImageCarousel from "@/components/image-carousel";
import { MovieResult, TvResult, UpcomingMoviesResponse } from "@/types/request-types-camelcase";
import { getBlurData } from "@/lib/blur-data-generator";
import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import { unstable_cache } from "next/cache";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export function generateStaticParams() {
  return [{ slug: "main" }]
}

export default async function DiscoverPage({ params }: { params: { slug: string } }) {

  const [trendingMoviesDailyRes, trendingMoviesWeeklyRes, trendingTvDailyRes, trendingTvWeeklyRes, popularMoviesRes, popularTvRes, upcomingMoviesRes] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        3, true
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "movie", time_window: "week", page: 1 },
        3, true
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        3, true
      ) as Promise<TvResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "week", page: 1 },
        3, true
      ) as Promise<TvResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "movie", 2, true) as Promise<MovieResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "tv", 2, true) as Promise<TvResult[]>,
      getUpcomingMovies({ page: 1 }, true) as Promise<UpcomingMoviesResponse>,
    ]);

  function isAnime(item: TvResult) {
    return item.originalLanguage?.toUpperCase() === "JA" && item.originCountry?.some(country => country.toUpperCase() === "JP")
  }

  const trendingTvWeekly = trendingTvWeeklyRes.filter(
    (item) =>
      (isAnime(item) || item.originalLanguage?.toUpperCase() === "EN") &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );
  const trendingTvDaily = trendingTvDailyRes.filter(
    (item) =>
      (isAnime(item) || item.originalLanguage?.toUpperCase() === "EN") &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );

  const trendingMoviesWeekly = trendingMoviesWeeklyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );
  const trendingMoviesDaily = trendingMoviesDailyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );

  const upcomingMovies = upcomingMoviesRes.results?.filter(item => item.originalLanguage?.toUpperCase() === "EN") ?? []

  const trendingTvIds = new Set([...trendingTvDaily.map(item => item.id), ...trendingTvWeekly.map(item => item.id)])
  const popularTv = popularTvRes?.filter(item => !trendingTvIds.has(item.id)) ?? []

  const trendingMovieIds = new Set([
    ...trendingMoviesDaily.map(item => item.id), ...trendingMoviesWeekly.map(item => item.id)
  ])
  const popularMovies = popularMoviesRes?.filter(item => !trendingMovieIds.has(item.id)) ?? []


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
        <CarouselToggle dailyItems={mkCards(await convertToDiscoverItems(trendingTvDaily), "tv")} weeklyItems={mkCards(await convertToDiscoverItems(trendingTvWeekly), "tv")} title="Trending Series" />
        <CarouselToggle dailyItems={mkCards(await convertToDiscoverItems(trendingMoviesDaily), "movie")} weeklyItems={mkCards(await convertToDiscoverItems(trendingMoviesWeekly), "movie")} title="Trending Movies" />
        <ImageCarousel
          items={mkCards(await convertToDiscoverItems(upcomingMovies), "movie")}
          titleString="Upcoming Movies"
        />
        <ImageCarousel
          items={mkCards(await convertToDiscoverItems(popularTv), "tv")}
          titleString="Popular Series"
        />
        <ImageCarousel
          items={mkCards(await convertToDiscoverItems(popularMovies), "movie")}
          titleString="Popular Movies"
        />
      </div>
    </main>
  );
}

const convertToDiscoverItems = unstable_cache(async (
  array: MovieResult[] | TvResult[]
): Promise<DiscoverItem[]> => {

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
})
