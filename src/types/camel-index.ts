import { int } from "drizzle-orm/mysql-core";
import {
  AggregateCreditsResponse,
  Cast,
  CreditsResponse,
  MovieResult,
  PersonResult,
  ReleasesReleaseDate,
  TvResult,
  VideosResponse,
  WatchProviderResponse,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  SimpleSeason,
  Network,
  SimplePerson,
  RatingResponse,
  Person,
  PersonCombinedCreditsResponse,
  PersonTaggedImagesResponse,
  PersonImagesResponse,
  PersonTvCreditsResponse,
  PersonMovieCreditsResponse,
  TvExternalIdsResponse,
  PersonExternalIdsResponse,
  MovieExternalIdsResponse,
  TvImagesResponse,
  MovieImagesResponse,
  SimilarMovieResponse,
  SimilarShowsResponse,
} from "./request-types-camelcase";

export interface CardTypes {
  movieResult?: MovieResult;
  tvResult?: TvResult;
  personResult?: PersonResult;
  cast?: Cast;
}

export interface CardTypes1 {
  result?: MovieResult | TvResult | PersonResult | Cast;
}

// export interface WatchlistI {
//   id: string;
//   userid: string | null;
//   watchlistName: string;
//   createdAt: string;
//   default: boolean;
//   items: WatchlistItemI[];
// }

// export interface WatchlistSchemaI {
//   id: string;
//   userid: string | null;
//   watchlistName: string;
//   createdAt: string;
//   default: boolean;
// }

export interface WatchlistItemI {
  id: number;
  watchlistId: string;
  itemId: string;
  tmdbId: number;
  title: string;
  itemType: "tv" | "movie";
  genres: string[];
  tmdbVoteAverage: number;
  rating: string;
  popularity: number;
  language: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  posterPath: string | null;
  backdropPath: string | null;
  summary: string;
}

export interface GroupedProvider {
  provider: string; // “Amazon Prime Video”
  name: string; // same as provider, or display name
  link: string; // watch URL
  icon: string; // logo URL
  types: string[]; // e.g. ["FLATRATE","ADS"]
  priceByType: Record<string, string>; // e.g. { FLATRATE: "", ADS: "" }
  resolutionsByType: Record<string, string[]>; // e.g. { FLATRATE: ["SD","HD","_4K"], ADS: ["SD","HD"] }
  audioByType?: Record<string, string[]>; // if you want per‐type audio lists
  subtitleByType?: Record<string, string[]>; // likewise for subtitles
}

export interface JustWatchInfo {
  ID: string;
  originalTitle?: string;
  isReleased?: boolean;
  releastyear?: string;
  genres?: string[];
  imdbScore?: string | Number;
  imdbCount?: string | Number;
  tmdbRating?: string | Number;
  tomatoMeter?: string | Number;
  productionCountries?: string[];
  shortDescription?: string;
  streams: GroupedProvider[];
}

export interface MediaTitle extends DiscoverItem {
  justWatchInfo: JustWatchInfo;
}

export type DiscoverItem = {
  tmdbId: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  posterBlurDataUrl?: string;
  voteAverage?: number | null;
  voteCount?: number | null;
  releaseDate?: Date | null;
  overview?: string;
  mediaType: "tv" | "movie";
};

export type FullMovie = {
  // summary fields
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
  releaseDate?: Date | null;
  posterBlurData?: string | null;
  backdropBlurData?: string | null;

  // detail fields
  adult: boolean;
  video: boolean;
  belongsToCollection?: string | null;
  imdbId?: string | null;
  originCountry?: string[];
  originalLanguage?: string | null;
  originalTitle?: string | null;
  budget?: number | null;
  revenue?: number | null;
  runtime?: number | null;
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
  tagline?: string | null;
  homepage?: string | null;
  genres?: Array<Genre>;
  productionCompanies?: Array<ProductionCompany>;
  productionCountries?: Array<ProductionCountry>;
  spokenLanguages?: Array<SpokenLanguage>;
  releases: {
    countries: Array<ReleasesReleaseDate>;
  };
  voteAverageDetail?: number | null; // if you want to override the summary one
  voteCountDetail?: number | null;

  videos: VideosResponse;
  credits?: CreditsResponse;
  watchProviders?: WatchProviderResponse;
  externalIds?: MovieExternalIdsResponse;
  images?: MovieImagesResponse;
  similar?: SimilarMovieResponse;
  mediaType: "movie"; // Not provided by api
};

export type FullTv = {
  // summary fields
  id: number;
  tmdbId: number;
  name: string;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
  firstAirDate?: Date | null;
  posterBlurData?: string | null;
  backdropBlurDataUrl?: string | null;
  darkVibrantBackdropHex?: string | null;

  // detail fields
  adult: boolean;
  originalLanguage?: string | null;
  originalName?: string | null;
  homepage?: string | null;
  status?: string | null;
  tagline?: string | null;
  type?: string | null;

  lastAirDate?: Date | null;
  numberOfSeasons?: number | null;
  numberOfEpisodes?: number | null;

  genres?: Genre[];
  createdBy?: SimplePerson[];
  runtime?: number;
  languages?: string[];
  networks?: Network[];
  seasons?: SimpleSeason[];

  videos?: VideosResponse;
  credits?: CreditsResponse;
  aggregateCredits?: AggregateCreditsResponse;
  watchProviders?: WatchProviderResponse;
  productionCompanies?: Array<ProductionCompany>;
  productionCountries?: Array<ProductionCountry>;
  originCountry?: string[];

  // e.g. { results: RatingResponse[] }
  spokenLanguages?: Array<SpokenLanguage>;
  contentRatings?: { results: RatingResponse[] };
  externalIds?: TvExternalIdsResponse;
  images?: TvImagesResponse;
  similar?: SimilarShowsResponse;
  mediaType: "tv"; // Not provided by api
};

export interface FullPerson extends Person {
  combinedCredits: PersonCombinedCreditsResponse;
  images: PersonImagesResponse;
  taggedImages: PersonTaggedImagesResponse;
  tvCredits: PersonTvCreditsResponse;
  movieCredits: PersonMovieCreditsResponse;
  externalIds?: PersonExternalIdsResponse;
}

export interface Candidate {
  id: number;
  title: string;
  year: number;
  overview: string | null;
  keywords: string[];
  posterPath: string | null;
  voteAverage: number;
  voteCount: number;
  mediaType: "tv" | "movie";
}

export interface CandidateResponse extends Candidate {
  score: number;
  reason: string;
  title: string;
}
