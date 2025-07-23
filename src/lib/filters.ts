import {
  EpisodeResult,
  MovieResult,
  TvResult,
} from "@/types/request-types-camelcase";
import { isValidDateString } from "./dates";
import { TMDB_TV_GENRES_MAP } from "./title-genres";

export function isEnglish(title: MovieResult | TvResult) {
  return title.originalLanguage?.toUpperCase() === "EN";
}

export function hasGenre(title: TvResult | MovieResult, genreId: number) {
  return title.genreIds?.includes(genreId);
}

export function isReleased(title: MovieResult | TvResult) {
  const airOrReleaseDate =
    (title as TvResult).firstAirDate?.toString() ||
    (title as MovieResult).releaseDate ||
    (title as EpisodeResult).airDate;

  if (!isValidDateString(airOrReleaseDate) || !airOrReleaseDate) return false;

  const date = new Date(airOrReleaseDate).valueOf();
  return date < new Date().valueOf();
}

export function isAnime(item: TvResult) {
  return (
    (item.originalLanguage?.toUpperCase() === "JA" &&
      item.originCountry?.some((country) => country.toUpperCase() === "JP") &&
      item.genreIds?.some(
        (id) => TMDB_TV_GENRES_MAP.get(id) === "Animation"
      )) ??
    false
  );
}

export function hasPoster(title: MovieResult | TvResult) {
  return !!title.posterPath;
}
