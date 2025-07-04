import { MovieResult, TvResult } from "@/types/request-types-snakecase";
import { Card } from "@/components/card";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import MediaCarousel from "@/components/media-carousel";

export async function Recommended({
  recommendations,
}: {
  recommendations: Array<MovieResult | TvResult>;
}) {
  const validItems = recommendations.filter((item) => item.poster_path);

  const items = validItems.map(
    (item: MovieResult | TvResult, index: number) => {
      const title = (item as any).title || (item as any).name;
      return (
        <Card
          title={title}
          overview={item.overview}
          imagePath={item.poster_path}
          baseUrl={BASE_POSTER_IMAGE_URL}
          key={index}
        />
      );
    }
  );
  return (
    <>
      {items?.length > 0 && (
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold`}>Recommended</h2>
          <MediaCarousel items={items} breakpointType="poster" />
        </div>
      )}
    </>
  );
}
