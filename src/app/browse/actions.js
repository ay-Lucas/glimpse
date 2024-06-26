import "server-only";
import { headers } from "next/headers";
import { options } from "@/lib/utils";
import { baseApiUrl, dateOptions } from "@/lib/constants";
export async function getTrendingTv(timeWindow) {
  const res = await fetch(`${baseApiUrl}/trending/tv/${timeWindow}`, options);
  return res.json();
}

export async function getTrendingMovies(timeWindow) {
  const res = await fetch(
    `${baseApiUrl}/trending/movie/${timeWindow}`,
    options,
  );
  return res.json();
}

export async function getPopularTv(page = 1) {
  const res = await fetch(`${baseApiUrl}/tv/popular?page=${page}`, options);
  return res.json();
}

export async function getPopularMovies(page = 1) {
  const res = await fetch(`${baseApiUrl}/movie/popular?page=${page}`, options);
  return res.json();
}

export async function getUpcomingMovies(page = 1) {
  const today = new Date().toLocaleDateString(dateOptions);
  console.log(today);
  const res = await fetch(
    `${baseApiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=2024-06-26&release_date.gte=2024-06-26&sort_by=popularity.desc`,
    options,
  );
  return res.json();
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
