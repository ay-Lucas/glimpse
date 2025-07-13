import { SlideImageCard } from "@/components/slide-image-card";
import {
  EpisodeResult,
  MovieResult,
  PersonTaggedImage,
} from "@/types/request-types-camelcase";

const SIZE_MAP: Record<string, string> = {
  poster: "w500",
  profile: "h632",
  still: "w500",
  backdrop: "w780",
};

function getAspectClass(width = 0, height = 0) {
  return width / height > 1 ? "aspect-[16/9]" : "aspect-[2/3]";
}

// 2. A dedicated Slide component
interface TaggedSlideProps {
  item: PersonTaggedImage;
  showIdMap: Map<number, string>;
}

export function TaggedSlide({ item, showIdMap }: TaggedSlideProps) {
  const { filePath, height, width, imageType, media, mediaType, id } = item;
  const srcSize = SIZE_MAP[imageType!] ?? SIZE_MAP.backdrop;
  const aspectClass = getAspectClass(width, height);

  // media could be EpisodeResult or MovieResult
  const episode = media as EpisodeResult;
  const name = (media as any).name || (media as any).title;
  const title =
    mediaType !== "movie"
      ? showIdMap.get(episode.showId!)!
      : (media as MovieResult).title;

  return (
    <div key={id ?? filePath} className="h-full pb-2">
      <SlideImageCard
        baseUrl={`/tmdb/t/p/${srcSize}`}
        imagePath={filePath}
        alt={`backdrop of ${name}`}
        aspectClass={aspectClass}
        unoptimized
      />
      <div>
        <p>{title}</p>
        {(mediaType === "tv" || mediaType === "episode") && (
          <div className="flex w-full items-center gap-x-5">
            <span>{name}</span>
            {mediaType === "episode" && (
              <span className="font-semibold">
                S{episode.seasonNumber} E{episode.episodeNumber}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
