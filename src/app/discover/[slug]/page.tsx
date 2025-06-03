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
  options,
} from "@/lib/constants";
import ImageCarousel from "@/components/image-carousel";
import { MovieResult, TvResult, UpcomingMoviesResponse } from "@/types/request-types-camelcase";
import { getBlurData } from "@/lib/blur-data-generator";
import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import { unstable_cache } from "next/cache";
import { DiscoverSearch } from "./_components/discover-search";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export function generateStaticParams() {
  return [{ slug: "main" }]
}

const NUM_PAGES = 2;


export async function fetchTmdbLists(
  reqOptions: RequestInit = options,
) {
  function isAnime(item: TvResult) {
    return item.originalLanguage?.toUpperCase() === "JA" && item.originCountry?.some(country => country.toUpperCase() === "JP")
  }

  const [trendingMoviesDailyRes, trendingMoviesWeeklyRes, trendingTvDailyRes, trendingTvWeeklyRes, popularMoviesRes, popularTvRes, upcomingMoviesRes] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "movie", time_window: "week", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<TvResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "week", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<TvResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "movie", NUM_PAGES, true, reqOptions) as Promise<MovieResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "tv", NUM_PAGES, true, reqOptions) as Promise<TvResult[]>,
      getUpcomingMovies({ page: 1 }, true, reqOptions) as Promise<UpcomingMoviesResponse>,
    ]);

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

  return { trendingMoviesDaily, trendingMoviesWeekly, trendingTvDaily, trendingTvWeekly, popularMovies, popularTv, upcomingMovies }
}

export default async function DiscoverPage({ params }: { params: { slug: string } }) {
  const { trendingMoviesDaily, trendingMoviesWeekly, trendingTvDaily, trendingTvWeekly, popularMovies, popularTv, upcomingMovies } = await fetchTmdbLists();

  const mkCards = (items: DiscoverItem[], mediaType: "tv" | "movie"): JSX.Element[] =>
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

  const trendingTvDailyCards = mkCards(await convertToDiscoverItems(trendingTvDaily), "tv");
  const trendingTvWeeklyCards = mkCards(await convertToDiscoverItems(trendingTvWeekly), "tv");
  const trendingMoviesDailyCards = mkCards(await convertToDiscoverItems(trendingMoviesDaily), "movie")
  const trendingMoviesWeeklyCards = mkCards(await convertToDiscoverItems(trendingMoviesWeekly), "movie")
  const popularMoviesCards = mkCards(await convertToDiscoverItems(popularMovies), "movie");
  const popularTvCards = mkCards(await convertToDiscoverItems(popularTv), "tv");
  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-0 lg:px-10 space-y-3 py-6 overflow-hidden">
        <div className="flex flex-col w-full pb-8 mx-auto space-y-3 px-1"><h1 className="text-2xl text-center font-semibold">Discover Movies &amp; TV Shows</h1><DiscoverSearch /></div>
        <CarouselToggle options={[{ items: trendingTvDailyCards, label: "Today" }, { items: trendingTvWeeklyCards, label: "This Week" }]} title="Trending Series" />
        <CarouselToggle options={[{ items: trendingMoviesDailyCards, label: "Today" }, { items: trendingMoviesWeeklyCards, label: "This Week" }]} title="Trending Movies" />
        <ImageCarousel
          items={mkCards(await convertToDiscoverItems(upcomingMovies), "movie")}
          titleString="Upcoming Movies"
        />
        <CarouselToggle options={[{ items: popularTvCards, label: "Series" }, { items: popularMoviesCards, label: "Movies" }]} title="Popular" />
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
