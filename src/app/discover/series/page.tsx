import { ImageCarousel } from "@/components/image-carousel";
import { sortPopular, isUnique } from "@/lib/utils";
import {
  getDeviceType,
  getPopular,
  getTrendingPages,
} from "@/app/discover/actions";

const MIN_POPULARITY = 500;
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
  const isMobile = (await getDeviceType()) === "mobile";
  const filteredPopularTv = popularTvRes.results?.filter((item) =>
    isUnique(item, trending),
  );

  return (
    <main className="w-full max-w-[1920px]">
      <div className="mx-auto space-y-1 w-10/12 md:w-[700px] lg:w-[1024px] xl:w-[1775px] select-none pt-5">
        <ImageCarousel
          data={trendingTv}
          type="movie"
          title="Trending"
          variant=""
        />
        <ImageCarousel
          data={filteredPopularTv!}
          type="tv"
          title="Popular"
          variant=""
        />
      </div>
    </main>
  );
}
