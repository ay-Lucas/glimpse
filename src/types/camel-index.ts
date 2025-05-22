import {
  AggregateCreditsResponse,
  Cast,
  CreditsResponse,
  MovieResult,
  PersonResult,
  ReleaseDate,
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

export interface WatchlistI {
  id: string;
  userid: string | null;
  watchlistName: string;
  createdAt: string;
  default: boolean;
  items: WatchlistItemI[];
}

export interface WatchlistSchemaI {
  id: string;
  userid: string | null;
  watchlistName: string;
  createdAt: string;
  default: boolean;
}

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
    countries: Array<ReleaseDate>;
  };
  voteAverageDetail?: number | null; // if you want to override the summary one
  voteCountDetail?: number | null;

  videos: VideosResponse;
  credits?: CreditsResponse;
  watchProviders?: WatchProviderResponse;
  // media_type: "tv"; // Not provided by api
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
  backdropBlurData?: string | null;

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
  episodeRunTime?: number[];
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
};
