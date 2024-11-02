import { Cast, MovieResult, PersonResult, TvResult } from "./request-types";

export interface CardTypes {
  movieResult?: MovieResult;
  tvResult?: TvResult;
  personResult?: PersonResult;
  cast?: Cast;
}

export interface CardTypes1 {
  result?: MovieResult | TvResult | PersonResult | Cast;
}

export interface Watchlist {
  id: string;
  watchlistName: string;
  createdAt: string;
  default: boolean;
  items: WatchlistItem[];
}

export interface WatchlistItem {
  id: number;
  watchlistId: string;
  itemId: string;
  tmdbId: number;
  title: string;
  itemType: "tv" | "movie";
  genres: string[];
}
