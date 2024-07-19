import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getPopular,
  getTrendingPages,
} from "@/app/discover/actions";
import { makeCarouselCards } from "../page";
import { MovieResult, TvResult } from "@/types/request-types";

const MIN_TRENDING_POPULARITY = 300;
const MIN_POPULAR_POPULARITY = 5;
export default async function Browse() {
  const NUMBER_OF_PAGES = 3;
  const [trendingTvRes, popularTvRes] = await Promise.all([
    getTrendingPages(
      { media_type: "tv", time_window: "day", page: 1 },
      NUMBER_OF_PAGES,
    ),
    getPopular({ page: 1, "vote_average.gte": MIN_POPULAR_POPULARITY }, "tv"),
  ]);
  const trendingTv = sortPopular(trendingTvRes, MIN_TRENDING_POPULARITY);

  const trending = sortPopular(trendingTv, MIN_TRENDING_POPULARITY);
  const filteredPopularTv = popularTvRes?.results?.filter(
    (item: TvResult | MovieResult) => isUnique(item, trending),
  );
  // Discover api endpoint doesn't return media type
  filteredPopularTv?.forEach((item) => (item.media_type = "tv"));

  return (
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <ImageCarousel items={makeCarouselCards(trending)} title="Trending" />
        <ImageCarousel
          items={makeCarouselCards(filteredPopularTv!)}
          title="Popular"
        />
      </div>
    </main>
  );
}
