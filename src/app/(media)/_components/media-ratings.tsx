import { getCachedJustWatch } from "../actions"
import TmdbLogo from "@/assets/tmdb-logo.svg";
import ImdbLogo from "@/assets/IMDB_Logo_2016.svg";
import CertifiedFreshTomato from "@/assets/Certified_Fresh_2018.svg"
import FreshTomato from "@/assets/Rotten_Tomatoes.svg"
import RottenTomato from "@/assets/Rotten_Tomatoes_rotten.svg"

interface MediaRatingsProps {
  tmdbVoteAverage: number | null
  tmdbVoteCount: number | null
  tmdbId: number
  imdbId: string | null
  isReleased: boolean
  title: string
  dateValue: Date | null
  mediaType: "tv" | "movie"
}

export default async function MediaRatings({ tmdbVoteAverage, tmdbVoteCount, tmdbId, imdbId, isReleased, title, dateValue, mediaType }: MediaRatingsProps) {
  const justWatchInfo = await getCachedJustWatch(title, mediaType, tmdbId, dateValue)
  const imdbScore = justWatchInfo?.imdbScore?.valueOf();
  const imdbCount = justWatchInfo?.imdbCount?.valueOf();
  const imdbLogo =
    <ImdbLogo
      alt="IMDb Logo"
      width={40}
      height={40}
      className="opacity-75"
    />

  const tomatoMeter = justWatchInfo?.tomatoMeter?.valueOf();
  const RottenTomatoesSearchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(
    title
  )}`;
  return (
    <div className="flex flex-row flex-wrap gap-5 items-center">
      {(tmdbVoteAverage != null && tmdbVoteCount != null) && (
        <Metric
          href={`https://www.themoviedb.org/${mediaType}/${tmdbId}`}
          Icon={
            <TmdbLogo
              alt="TMDB Logo"
              width={40}
              height={40}
              className="opacity-75 mr-2"
            />}
          value={`${Math.round(tmdbVoteAverage * 10)}%`}
          count={tmdbVoteCount}
        />)}
      {imdbScore && imdbCount && (
        <Metric
          href={imdbId ? `https://www.imdb.com/title/${imdbId}` : undefined}
          Icon={imdbLogo}
          value={<><strong>{imdbScore}</strong>/10</>}
          count={Number(imdbCount)}
        />
      )}
      {typeof tomatoMeter === "number" && (
        <Metric
          href={RottenTomatoesSearchUrl}
          Icon={getTomatoMeterType(tomatoMeter).svg}
          value={`${tomatoMeter}%`}
        />
      )}
    </div>
  )
}

function OptionalLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

interface MetricProps {
  href?: string;
  Icon: JSX.Element;
  value: React.ReactNode;
  count?: number;
}

function Metric({ href, Icon, value, count }: MetricProps) {
  return (
    <div className="flex items-center space-x-1">
      <OptionalLink href={href}>{Icon}</OptionalLink>
      <span className="text-lg">{value}</span>
      {count !== undefined && <span className="text-gray-400">({count})</span>}
    </div>
  );
}

/*
 * Converts TomatoMeter score (0–100) to a label and icon
  */
function getTomatoMeterType(tomatoMeter: number) {

  if (tomatoMeter >= 75 && tomatoMeter <= 100) {
    return {
      svg: <CertifiedFreshTomato height={30} width={30} />,
      label: "Certified Fresh"
    }
  }

  else if (tomatoMeter >= 60 && tomatoMeter <= 100) {
    return {
      svg: <FreshTomato height={30} width={30} />,
      label: "Fresh"
    }
  }
  else {
    return {
      svg: <RottenTomato height={25} width={25} />,
      label: "Rotten"
    }
  }
}

