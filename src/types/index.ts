import {
  Cast,
  CreditsResponse,
  MovieResult,
  MovieResultsResponse,
  MovieReviewsResponse,
  PersonResult,
  TvResult,
  TvResultsResponse,
  TvReviewsResponse,
  Video,
} from "./request-types";
import { Genre } from "./types";

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

export interface Item {
  title?: string;
  credits?: CreditsResponse;
  videos?: Array<Video>;
  videoPath?: string;
  backdropPath?: string;
  posterPath?: string;
  trailerPath?: string;
  genres?: Array<Genre>;
  recommendations?: MovieResultsResponse | TvResultsResponse;
  reviews?: MovieReviewsResponse | TvReviewsResponse;
  rating?: string;
  overview?: string;
  releaseDate?: string;
  details?: React.ReactNode;
  voteAverage?: number;
  media_type?: "tv" | "movie" | "person";
  tmdbId: number;
  popularity: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  language?: string;
}
