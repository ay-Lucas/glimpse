import { ImageCarousel } from "./_components/image-carousel";
import { options, shuffle, bubbleSort } from "@/lib/utils";

const baseImageUrl = "https://image.tmdb.org/t/p/original";
const baseUrl = "https://api.themoviedb.org/3";
const MIN_POPULARITY = 200;
const MIN_TRENDING_POPULARITY = 100;

// time window: day or week
async function getTrendingTv(timeWindow) {
  const res = await fetch(`${baseUrl}/trending/tv/${timeWindow}`, options);
  return res.json();
}

async function getTrendingMovies(timeWindow) {
  const res = await fetch(`${baseUrl}/trending/movie/${timeWindow}`, options);
  return res.json();
}

function sortPopular(array, minPopularity = 0) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > 0)
    array = array.filter((item) => item.popularity >= minPopularity);
  return array;
}

export default async function HomePage() {
  const [tvRes, movieRes] = await Promise.all([
    getTrendingTv("day"),
    getTrendingMovies("day"),
  ]);
  const trendingTv = sortPopular(tvRes.results, MIN_POPULARITY);
  const trendingMovies = sortPopular(movieRes.results, MIN_POPULARITY);

  const trendingTvAndMovies = tvRes.results.concat(movieRes.results);
  const trending = sortPopular(trendingTvAndMovies, MIN_TRENDING_POPULARITY);
  console.log(trendingTv);
  // const trending = shuffle(trendingTvAndMovies);

  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-visible">
        <ImageCarousel
          images={
            trending.map((item) => `${baseImageUrl}${item.poster_path}`) ?? []
          }
          title="Trending"
        />
        <ImageCarousel
          images={
            trendingTv.map((show) => `${baseImageUrl}${show.poster_path}`) ?? []
          }
          title="TV Shows"
        />
        <ImageCarousel
          images={
            trendingMovies.map(
              (movie) => `${baseImageUrl}${movie.poster_path}`,
            ) ?? []
          }
          title="Movies"
        />
      </div>
    </main>
  );
}
