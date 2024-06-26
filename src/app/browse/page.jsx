import { ImageCarousel } from "./_components/image-carousel";
import { headers } from "next/headers";
import { options, shuffle, bubbleSort } from "@/lib/utils";

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

export const getDeviceType = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  return userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  )
    ? "mobile"
    : "desktop";
};

export default async function HomePage() {
  const [tvRes, movieRes] = await Promise.all([
    getTrendingTv("week"),
    getTrendingMovies("week"),
  ]);
  const trendingTv = sortPopular(tvRes.results, MIN_POPULARITY);
  const trendingMovies = sortPopular(movieRes.results, MIN_POPULARITY);

  const trendingTvAndMovies = tvRes.results.concat(movieRes.results);
  const trending = sortPopular(trendingTvAndMovies, MIN_TRENDING_POPULARITY);

  const isMobile = getDeviceType() === "mobile";
  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden">
        <ImageCarousel data={trending} isMobile={isMobile} title="Trending" />
        <ImageCarousel data={trendingTv} isMobile={isMobile} title="TV Shows" />
        <ImageCarousel
          data={trendingMovies}
          isMobile={isMobile}
          title="Movies"
        />
      </div>
    </main>
  );
}
