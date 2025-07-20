import { MediaCard, MediaCardMeta } from "./media-card.tsx";
import { Expandable } from "../../_components/expandable";
import { BASE_MEDIUM_STILL_IMAGE_URL } from "@/lib/constants";
import { Episode } from "@/types/request-types-camelcase.ts";
import TmdbRating from "../../_components/tmdb-rating.tsx";
import { isPast } from "@/lib/dates.ts";

export function EpisodeCard({
  episode: e,
  showId,
}: {
  episode: Episode;
  showId: number;
}) {
  const hasAired = !!e.airDate && isPast(e.airDate);
  const meta: MediaCardMeta[] = [
    {
      value:
        hasAired && e.voteAverage != null ? (
          <TmdbRating
            mediaType="tv"
            tmdbId={showId}
            tmdbVoteAverage={e.voteAverage}
            tmdbVoteCount={e.voteCount}
          />
        ) : null,
    },
  ];

  const episodeTitle =
    e.seasonNumber !== 0
      ? `S${e.seasonNumber}.E${e.episodeNumber}`
      : `Special E${e.episodeNumber}`;

  return (
    <MediaCard
      href={`/tv/${showId}/season/${e.seasonNumber}/episode/${e.episodeNumber}`}
      imageType="still"
      imageSrc={
        e.stillPath ? `${BASE_MEDIUM_STILL_IMAGE_URL}${e.stillPath}` : undefined
      }
      airDate={e.airDate}
      imageAlt={`${e.name} still`}
      title={
        <div className="flex flex-col">
          <span className="text-gray-400">{episodeTitle}</span>
          <span className="">{e.name}</span>
        </div>
      }
      meta={meta}
    >
      <Expandable lineHeight={21}>
        <p className="md:text-md text-sm">{e.overview}</p>
      </Expandable>
    </MediaCard>
  );
}
