import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import { convertToDiscoverItems, mkCards } from "./discover-utils";
import CarouselToggle from "@/app/(media)/_components/carousel-toggle";
import ImageCarousel from "@/components/image-carousel";

export async function TrendingSeriesCarousel(data: ({ daily: TvResult[], weekly: TvResult[], blurMap: Map<number, string> })) {
  const [trendingTvDailyCards, trendingTvWeeklyCards] = await Promise.all([
    mkCards(await convertToDiscoverItems(data.daily, data.blurMap), "tv"),
    mkCards(await convertToDiscoverItems(data.weekly, data.blurMap), "tv")
  ]);

  return <CarouselToggle options={[{ items: trendingTvDailyCards, label: "Today" }, { items: trendingTvWeeklyCards, label: "This Week" }]} title="Trending Series" />
}

export async function TrendingMoviesCarousel(data: ({ daily: MovieResult[], weekly: MovieResult[], blurMap: Map<number, string> })) {
  const [trendingMoviesDailyCards, trendingMoviesWeeklyCards] = await Promise.all([
    mkCards(await convertToDiscoverItems(data.daily, data.blurMap), "movie"),
    mkCards(await convertToDiscoverItems(data.weekly, data.blurMap), "movie")
  ]);

  return <CarouselToggle options={[{ items: trendingMoviesDailyCards, label: "Today" }, { items: trendingMoviesWeeklyCards, label: "This Week" }]} title="Trending Movies" />
}

export async function PopularMoviesAndSeriesCarousel(data: ({ tv: TvResult[], movies: MovieResult[], blurMap: Map<number, string> })) {
  const [popularTvCards, popularMovieCards] = await Promise.all([
    mkCards(await convertToDiscoverItems(data.tv, data.blurMap), "tv"),
    mkCards(await convertToDiscoverItems(data.movies, data.blurMap), "movie")
  ]);

  return <CarouselToggle options={[{ items: popularTvCards, label: "Series" }, { items: popularMovieCards, label: "Movies" }]} title="Popular" />
}

export async function UpcomingMoviesCarousel(data: ({ movies: MovieResult[], blurMap: Map<number, string> })) {
  const upcomingMovieCards = mkCards(await convertToDiscoverItems(data.movies, data.blurMap), "movie")

  return <ImageCarousel items={upcomingMovieCards} titleString="Upcoming Movies" />
}

