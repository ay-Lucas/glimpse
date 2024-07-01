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
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Trending</h2>
        <ImageCarousel data={trendingTv} type="movie" isMobile={isMobile} />
        <h2 className={`pl-3 text-xl md:text-2xl font-bold`}>Popular</h2>
        <ImageCarousel data={filteredPopularTv} type="tv" isMobile={isMobile} />
      </div>
    </main>
  );
}
