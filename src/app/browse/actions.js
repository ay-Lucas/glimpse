import "server-only";
import { headers } from "next/headers";
import { options } from "@/lib/utils";
import { baseApiUrl } from "@/lib/constants";
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

export async function getPopularTv(page, minPopularity) {
  const res = await fetch(
    `${baseApiUrl}/discover/tv?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&vote_count.gte=${minPopularity}&with_original_language=en`,
    options,
  );
  return res.json();
}

export async function getPopularMovies(page, minPopularity) {
  const res = await fetch(
    `${baseApiUrl}/discover/movie?include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc&vote_count.gte=${minPopularity}&with_original_language=en`,
    options,
  );
  return res.json();
}

export async function getUpcomingMovies(page) {
  const today = new Date().toISOString().split("T")[0];
  console.log(today);
  const res = await fetch(
    `${baseApiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_date.gte=${today}&release_date.gte=2024-06-26&sort_by=popularity.desc`,
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
