import { headers } from "next/headers";
import { baseApiUrl, options } from "@/lib/constants";
import {
  DiscoverMovieRequest,
  DiscoverTvRequest,
  DiscoverTvResponse,
  TrendingRequest,
  TrendingResponse,
  UpcomingMoviesRequest,
  UpcomingMoviesResponse,
} from "@/types/request-types";

export async function getTrending(
  request: TrendingRequest,
): Promise<TrendingResponse> {
  const res = await fetch(
    `${baseApiUrl}/trending/${request.mediaType}/${request.timeWindow}`,
    options,
  );
  return res.json();
}

export async function getPopular(
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
): Promise<DiscoverTvResponse | DiscoverTvResponse> {
  const res = await fetch(
    `${baseApiUrl}/discover/${mediaType}?include_adult=false&language=en-US&page=${request.page}&sort_by=popularity.desc&vote_average.gte=${request["vote_average.gte"]}&with_original_language=en`,
    options,
  );
  return res.json();
}

export async function getUpcomingMovies(
  request: UpcomingMoviesRequest,
): Promise<UpcomingMoviesResponse> {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${baseApiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&&page=${request.page}&primary_release_date.gte=${today}&release_date.gte=2024-06-26&sort_by=popularity.desc`,
    options,
  );
  return res.json();
}

export async function getDeviceType(): Promise<string> {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") ?? "WPDesktop";

  return userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  )
    ? "mobile"
    : "desktop";
}
