import { WatchlistItemModel } from "@/lib/repositories/watchlist";
import {
  AggregateCreditsResponse,
  CreditsResponse,
  MovieExternalIdsResponse,
  MovieImagesResponse,
  MovieReleaseDatesResponse,
  MovieResult,
  ShowContentRatingResponse,
  SimilarShowsResponse,
  TvExternalIdsResponse,
  TvImagesResponse,
  TvResult,
  VideosResponse,
  WatchProviderResponse,
  PersonCombinedCreditsResponse,
  PersonExternalIdsResponse,
  PersonImagesResponse,
  PersonMovieCreditsResponse,
  PersonTaggedImagesResponse,
  PersonTvCreditsResponse,
  MovieRecommendationsResponse,
  TvRecommendationsResponse,
  Crew,
  GuestStar,
  Person,
  Episode,
  Image,
  Backdrop,
} from "./request-types-camelcase";
import { JustWatchInfo } from "./camel-index";
import { EpisodeExternalIdsResponse } from "./request-types-snakecase";

export type TmdbTvDetailsResponseAppendedWatchlist =
  TmdbTvDetailsResponseAppended & WatchlistItemModel;

export type TmdbMovieDetailsResponseAppendedWatchlist =
  TmdbMovieDetailsResponseAppended & WatchlistItemModel;

export interface TmdbTvDetailsBackfilled extends TmdbTvDetailsResponseAppended {
  justWatchInfo?: JustWatchInfo | null;
}

export interface TmdbTvDetailsResponseAppended extends TmdbTvDetailsResponse {
  videos?: VideosResponse;
  credits?: CreditsResponse;
  aggregateCredits?: AggregateCreditsResponse;
  watchProviders?: WatchProviderResponse;
  contentRatings?: ShowContentRatingResponse;
  externalIds?: TvExternalIdsResponse;
  images?: TvImagesResponse;
  similar?: SimilarShowsResponse;
  recommendations?: TvRecommendationsResponse;
}

export interface TmdbTvDetailsResponse extends TvResult {
  createdBy: CreatedBy[];
  episodeRunTime: number[];
  genres: Genre[];
  homepage: string;
  inProduction: boolean;
  languages: string[];
  lastAirDate?: string | null;
  lastEpisodeToAir?: EpisodeToAir | null;
  nextEpisodeToAir?: EpisodeToAir | null;
  networks: Network[];
  numberOfEpisodes: number;
  numberOfSeasons: number;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  seasons: Season[];
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

export interface TmdbMovieDetailsResponse extends MovieResult {
  belongsToCollection: boolean;
  budget: number;
  genres: Genre[];
  homepage: string;
  revenue: number;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
}

export interface TmdbMovieDetailsResponseAppended
  extends TmdbMovieDetailsResponse {
  videos?: VideosResponse;
  credits?: CreditsResponse;
  aggregateCredits?: AggregateCreditsResponse;
  watchProviders?: WatchProviderResponse;
  // releases?: { countries: ReleasesReleaseDate[] }; // overlaps with releaseDates -> which is better
  releaseDates?: MovieReleaseDatesResponse;
  externalIds?: MovieExternalIdsResponse;
  images?: MovieImagesResponse;
  similar?: SimilarShowsResponse;
  recommendations?: MovieRecommendationsResponse;
}

export interface TmdbMovieDetailsBackfilled
  extends TmdbMovieDetailsResponseAppended {
  justWatchInfo?: JustWatchInfo | null;
}

export interface TmdbPersonDetailsAppended extends TmdbPersonDetails {
  combinedCredits: PersonCombinedCreditsResponse;
  images: PersonImagesResponse;
  taggedImages: PersonTaggedImagesResponse;
  tvCredits: PersonTvCreditsResponse;
  movieCredits: PersonMovieCreditsResponse;
  externalIds?: PersonExternalIdsResponse;
}

export interface TmdbPersonDetails {
  birthday?: string | null;
  knownForDepartment?: string;
  deathday?: string | null;
  id: number;
  name?: string;
  alsoKnownAs?: string[];
  gender?: number;
  biography?: string;
  popularity: number;
  placeOfBirth?: string;
  profilePath?: string;
  adult?: boolean;
  imdbId?: string;
  homepage?: string | null;
}

export interface TmdbEpisodeDetailsAppended extends Episode {
  externalIds?: TvExternalIdsResponse;
  images?: { stills: Backdrop[] };
  credits?: CreditsResponse;
  videos?: VideosResponse;
}

export interface CreatedBy {
  id: number;
  creditId: string;
  name: string;
  gender: number;
  profilePath: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface EpisodeToAir {
  id: number;
  name: string;
  overview: string;
  voteAverage: number;
  voteCount: number;
  airDate: string;
  episodeNumber: number;
  productionCode: string;
  runtime: number;
  seasonNumber: number;
  showId: number;
  stillPath: string;
}

export interface Network {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
}

export interface ProductionCompany {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
}

export interface ProductionCountry {
  iso31661: string;
  name: string;
}

export interface Season {
  airDate?: string;
  episodeCount?: number;
  id?: number;
  name?: string;
  overview?: string;
  posterPath?: string;
  seasonNumber?: number;
  voteAverage?: number;
}

export interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}
