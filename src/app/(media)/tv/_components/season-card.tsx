import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import { MediaCard, MediaCardMeta } from "./media-card.tsx";
import { Expandable } from "../../_components/expandable";
import TmdbLogo from "@/assets/tmdb-logo.svg";
import Metric from "../../_components/metric";
import { Season } from "@/types/tmdb-camel.ts";
import { isPast } from "@/lib/dates.ts";

export default function SeasonCard({
  season: s,
  showId,
}: {
  season: Season;
  showId: number;
}) {
  const title =
    s.seasonNumber === 0 && s.name === "Specials"
      ? "Specials"
      : `Season ${s.seasonNumber}`;

  const hasAired = !!s.airDate && isPast(s.airDate);

  const meta: MediaCardMeta[] = [
    { label: "Episode Count", value: s.episodeCount },
    {
      value:
        hasAired && s.voteAverage != null ? (
          <Metric
            href={`https://www.themoviedb.org/tv/${showId}`}
            Icon={
              <TmdbLogo
                alt="TMDB Logo"
                width={40}
                height={40}
                className="mr-2 opacity-75"
              />
            }
            value={`${Math.round(s.voteAverage * 10)}%`}
          />
        ) : (
          "—"
        ),
    },
  ];

  const formattedDate = s.airDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
        year: "numeric",
      }).format(new Date(s.airDate))
    : null;
  return (
    <MediaCard
      href={`/tv/${showId}/season/${s.seasonNumber}`}
      imageSrc={
        s.posterPath ? `${BASE_POSTER_IMAGE_URL}${s.posterPath}` : undefined
      }
      imageType="poster"
      airDate={s.airDate}
      imageAlt={`${s.name} poster`}
      title={
        <>
          <div className="flex w-full flex-col xs:flex-row xs:justify-between">
            <span>{title}</span>
            <time
              dateTime={s.airDate}
              className="flex items-center text-sm font-normal text-gray-400"
            >
              {formattedDate}
            </time>
          </div>
        </>
      }
      meta={meta}
    >
      <Expandable lineHeight={21}>
        <p className="md:text-md text-sm">{s.overview}</p>
      </Expandable>
    </MediaCard>
  );
}
