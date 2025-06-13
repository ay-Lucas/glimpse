import {
  fetchTmdbMovieLists,
  fetchTmdbTvLists,
} from "@/app/discover/actions";
import { Card } from "@/components/card";
import Link from "next/link";
import {
  BaseImageUrl,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import ImageCarousel from "@/components/image-carousel";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import { getBlurData } from "@/lib/blur-data-generator";
import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import { DiscoverSearch } from "./_components/discover-search";
import { DiscoverItem } from "@/types/camel-index";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default async function DiscoverPage() {

  const [{ trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies }, { trendingTvDaily, trendingTvWeekly, popularTv }] =
    await Promise.all([fetchTmdbMovieLists(), fetchTmdbTvLists()])

  const mkCards = (items: DiscoverItem[], mediaType: "tv" | "movie"): JSX.Element[] =>
    items.map((item) => (
      <Link href={`/${mediaType}/${item.tmdbId}`} key={item.tmdbId} prefetch={true}>
        <Card
          title={item.title}
          overview={item.overview}
          // blurDataURL={`${BaseImageUrl.BLUR}${item.posterPath}`}
          imagePath={`${BaseImageUrl.POSTER}${item.posterPath}`}
          blurDataURL={item.posterBlurDataUrl ?? DEFAULT_BLUR_DATA_URL}
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

  // console.log("Discover page rendered!")

  return (
    <main className="w-screen max-w-[1920px] mx-auto">
      <div className="px-2 md:px-5 lg:px-10 space-y-3 py-6 overflow-hidden">
        <div className="flex flex-col w-full pb-8 mx-auto space-y-3 px-1">
          <h1 className="text-xl sm:text-2xl text-center font-semibold">Discover Movies &amp; TV Shows</h1>
          <DiscoverSearch />
        </div>
        <CarouselToggle options={[{ items: trendingTvDailyCards, label: "Today" }, { items: trendingTvWeeklyCards, label: "This Week" }]} title="Trending Series" />
        <CarouselToggle options={[{ items: trendingMoviesDailyCards, label: "Today" }, { items: trendingMoviesWeeklyCards, label: "This Week" }]} title="Trending Movies" />
        <CarouselToggle options={[{ items: popularTvCards, label: "Series" }, { items: popularMoviesCards, label: "Movies" }]} title="Popular" />
        <ImageCarousel
          items={mkCards(await convertToDiscoverItems(upcomingMovies), "movie")}
          titleString="Upcoming Movies"
        />
      </div>
    </main>
  );
}

const convertToDiscoverItems = (async (
  array: MovieResult[] | TvResult[]
): Promise<DiscoverItem[]> => {

  const promises = array.map(async (item) => {
    const title = (item as MovieResult).title || (item as TvResult).name;
    const posterBlurDataUrl = item.posterPath
      ? await getBlurData(`${BaseImageUrl.BLUR}${item.posterPath}`)
      : DEFAULT_BLUR_DATA_URL;
    return {
      tmdbId: item.id,
      title: title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      posterBlurDataUrl,
      overview: item.overview,
    };
  });

  return await Promise.all(promises);
})
