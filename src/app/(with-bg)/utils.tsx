import { getBlurData } from "@/lib/blur-data-generator";
import { BASE_BLUR_IMAGE_URL } from "@/lib/constants";
import { getRedisBlurValue } from "@/services/cache";
import {
  fetchTrendingMovies,
  fetchTrendingTv,
} from "../(browse)/discover/actions";

export async function getBackdrops() {
  const [{ trendingMoviesDaily }, { trendingTvDaily }] = await Promise.all([
    fetchTrendingMovies(),
    fetchTrendingTv(),
  ]);

  const trendingDailyRaw = [...trendingMoviesDaily, ...trendingTvDaily].map(
    (item) => {
      return {
        backdropPath: item.backdropPath,
        id: item.id,
        mediaType: item.mediaType,
      };
    }
  );
  const trendingDaily = trendingDailyRaw.filter(
    (p) =>
      typeof p.backdropPath === "string" &&
      p.backdropPath.length > 0 &&
      p.mediaType
  );

  const redisBlurData =
    trendingDaily.length > 0
      ? (
          await getRedisBlurValue(
            trendingDaily[0]!.mediaType!,
            trendingDaily[0]!.id
          )
        )?.backdropBlur
      : null;
  const firstBackdropBlur =
    redisBlurData ??
    (await getBlurData(
      `${BASE_BLUR_IMAGE_URL}${trendingDaily[0]!.backdropPath}`
    ));
  const backdropPathsRaw = trendingDaily.map((item) => item.backdropPath);
  const backdropPaths = backdropPathsRaw.filter(
    (p): p is string => typeof p === "string" && p.length > 0
  );
  return { backdropPaths, firstBackdropBlur };
}
