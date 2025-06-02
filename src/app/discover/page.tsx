import {
  getTrendingSeries,
  getTrendingMovies,
  getPopularSeries,
  getPopularMovies,
  getUpcomingMovieSummaries,
  DiscoverItem,
} from "@/app/discover/actions";
import { Card } from "@/components/card";
import Link from "next/link";
import {
  BaseImageUrl,
  DISCOVER_LIMIT,
} from "@/lib/constants";
import ImageCarousel from "@/components/image-carousel";

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
        <ImageCarousel
          items={mkCards(trendingTvItems, "tv")}
          title="Trending Series"
        />
        <ImageCarousel
          items={mkCards(trendingMovieItems, "movie")}
          title="Trending Movies"
        />
        <ImageCarousel
          items={mkCards(upcomingMovieItems, "movie")}
          title="Upcoming Movies"
        />
        <ImageCarousel
          items={mkCards(popularTvItems, "tv")}
          title="Popular Series"
        />
        <ImageCarousel
          items={mkCards(popularMovieItems, "movie")}
          title="Popular Movies"
        />
      </div>
    </main>
  );
}
