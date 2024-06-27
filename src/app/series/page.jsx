import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getPopularTv,
  getTrendingTv,
} from "@/app/browse/actions";

const MIN_POPULARITY = 500;
const MIN_TRENDING_POPULARITY = 300;
const MIN_POPULAR_POPULARITY = 8000;
export default async function Browse() {
  const [trendingTvRes, popularTvRes] = await Promise.all([
    getTrendingTv("week"),
    getPopularTv(1, MIN_POPULAR_POPULARITY),
  ]);
  const trendingTv = sortPopular(
    trendingTvRes.results,
    MIN_TRENDING_POPULARITY,
  );

  const trending = sortPopular(trendingTv, MIN_TRENDING_POPULARITY);
  const isMobile = getDeviceType() === "mobile";
  const filteredPopularTv = popularTvRes.results.filter((item) =>
    isUnique(item, trending),
  );

  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-hidden">
        <ImageCarousel
          data={trendingTv}
          type="movie"
          isMobile={isMobile}
          title="Trending Series"
        />
        <ImageCarousel
          data={filteredPopularTv}
          type="tv"
          isMobile={isMobile}
          title="Popular Series"
        />
      </div>
    </main>
  );
}
