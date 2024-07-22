"use server";
import { headers } from "next/headers";
import { baseApiUrl, options } from "@/lib/constants";
import {
  DiscoverMovieRequest,
  DiscoverMovieResponse,
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
    `${baseApiUrl}/trending/${request.media_type}/${request.time_window}?&page=${request.page}`,
    options,
  );
  return res.json();
}

export async function getTrendingPages(
  request: TrendingRequest,
  numberOfPages: number,
) {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(
      getTrending({
        media_type: request.media_type,
        time_window: request.time_window,
        page: i + 1,
      }),
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);
  return arrays;
}

export async function getPopular(
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
): Promise<DiscoverTvResponse | DiscoverMovieResponse> {
  const res = await fetch(
    `${baseApiUrl}/discover/${mediaType}?include_adult=false&language=en-US&region=US&page=${request.page}&sort_by=popularity.desc&vote_average.gte=${request["vote_average.gte"]}&with_original_language=en`,
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

// export async function getDeviceType(): Promise<string> {
//   const headersList = headers();
//   const userAgent = headersList.get("user-agent") ?? "WPDesktop";
//
//   return userAgent.match(
//     /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
//   )
//     ? "mobile"
//     : "desktop";
// }
export async function getDeviceType() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  return userAgent;
}
