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
