import MediaCarousel from "@/components/media-carousel";
import { SlideCard } from "@/components/slide-card";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";

export async function RecommendationsSection({
  titles,
  mediaType,
}: {
  titles: (MovieResult | TvResult)[];
  mediaType: "tv" | "movie";
}) {
  const validTitles = titles.filter((item) => item.posterPath);

  const items = validTitles.map(
    (item: MovieResult | TvResult, index: number) => {
      const title = (item as TvResult).name || (item as MovieResult).title;
      const releaseDateStr =
        (item as TvResult).firstAirDate || (item as MovieResult).releaseDate;
      const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;
      return (
        <SlideCard
          rating={null}
          alt={`poster of ${title}`}
          aspectClass="aspect-[2/3]"
          title={title}
          overview={item.overview}
          tmdbVoteAverage={item.voteAverage}
          tmdbVoteCount={item.voteCount}
          releaseDate={releaseDate}
          mediaType={mediaType}
          tmdbId={item.id}
          imagePath={item.posterPath}
          baseUrl={BASE_POSTER_IMAGE_URL}
          key={index}
        />
      );
    }
  );
  return (
    <>
      {items?.length > 0 && (
        <section className="media-card space-y-4">
          <h2 className={`text-2xl font-bold`}>Recommendations</h2>
          <MediaCarousel items={items} breakpointType="poster" />
        </section>
      )}
    </>
  );
}
