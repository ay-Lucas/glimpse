import { getAllDiscoverTitles } from "@/lib/actions";
import { TrendingMoviesCarousel } from "../../discover/_components/discover-carousels";
import { getBlurDataMap } from "../../discover/_components/discover-utils";
import { fetchTmdbMovieLists } from "../../discover/actions";
import TitleCarousel from "@/components/title-carousel";
import {
  getNowPlayingMovieList,
  getTopRatedMovieList,
  getUpcomingMovieList,
} from "../actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Movie Lists",
};

export default async function MovieListPage() {
  const titles = await getAllDiscoverTitles();
  const blurMap = await getBlurDataMap(titles);

  const [{ popularMovies, trendingMoviesDaily, trendingMoviesWeekly }] =
    await Promise.all([fetchTmdbMovieLists()]);

  const [nowPlaying, topRated, upcoming] = await Promise.all([
    getNowPlayingMovieList(),
    getTopRatedMovieList(),
    getUpcomingMovieList(),
  ]);

  return (
    <>
      <h1 className="pb-4 text-start text-3xl font-bold">Movie Lists</h1>
      <TrendingMoviesCarousel
        daily={trendingMoviesDaily}
        weekly={trendingMoviesWeekly}
        blurMap={blurMap}
      />
      <TitleCarousel
        title="Popular"
        titles={popularMovies}
        mediaType="movie"
        breakpointType="title"
      />
      <TitleCarousel
        title="Top Rated"
        titles={topRated}
        mediaType="movie"
        breakpointType="title"
      />
      <TitleCarousel
        title="Now Playing"
        titles={nowPlaying}
        mediaType="movie"
        breakpointType="title"
      />
      <TitleCarousel
        title="Upcoming"
        titles={upcoming}
        mediaType="movie"
        breakpointType="title"
      />
    </>
  );
}

