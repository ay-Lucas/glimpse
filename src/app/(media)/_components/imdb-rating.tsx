import ImdbLogo from "@/assets/IMDB_Logo_2016.svg";
import Metric from "./metric";

export default function ImdbRating({
  score,
  count,
  imdbId,
}: {
  score: number;
  count: number;
  imdbId: string | null;
}) {
  const imdbLogo = (
    <ImdbLogo alt="IMDb Logo" width={40} height={40} className="opacity-75" />
  );
  return (
    <Metric
      href={imdbId ? `https://www.imdb.com/title/${imdbId}` : undefined}
      Icon={imdbLogo}
      value={
        <>
          <strong>{score}</strong>/10
        </>
      }
      count={count}
    />
  );
}
