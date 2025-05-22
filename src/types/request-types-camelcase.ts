import { Response } from "./types";

export interface MovieResult {
  posterPath?: string;
  adult?: boolean;
  overview?: string;
  releaseDate?: string;
  genreIds?: Array<number>;
  id: number;
  mediaType: "movie";
  originalTitle?: string;
  originalLanguage?: string;
  title: string;
  backdropPath?: string;
  popularity?: number;
  voteCount?: number;
  video?: boolean;
  voteAverage?: number;
  videos?: {
    results: Array<Video>;
  };
  credits?: CreditsResponse;
  rating?: string; // Not provided by TMDB
}

export interface TvResult {
  posterPath?: string;
  popularity?: number;
  id: number;
  overview?: string;
  backdropPath?: string;
  voteAverage?: number;
  mediaType: "tv";
  firstAirDate?: string;
  originCountry?: Array<string>;
  genreIds?: Array<number>;
  originalLanguage?: string;
  voteCount?: number;
  name: string;
  originalName?: string;
  videos?: {
    results: Array<Video>;
  };
  credits: CreditsResponse;
  aggregateCredits?: AggregateCreditsResponse;
  rating?: string;
}

export interface PersonResult {
  profilePath?: string;
  adult?: boolean;
  id?: number;
  name?: string;
  mediaType: "person"; // Not provided by api
  popularity?: number;
  knownFor?: Array<MovieResult | TvResult>;
}

export interface EpisodeResult extends SimpleEpisode {
  mediaType: "tv_episode";
  runtime?: string;
}

export interface Person {
  birthday?: string | null;
  knownForDepartment?: string;
  deathday?: null | string;
  id?: number;
  name?: string;
  alsoKnownAs?: string[];
  gender?: number;
  biography?: string;
  popularity?: number;
  placeOfBirth?: string;
  profilePath?: string;
  adult?: boolean;
  imdbId?: string;
  homepage?: null | string;
  mediaType: "person"; // Not provided by api
}

export interface Image {
  baseUrl?: string;
  secureBaseUrl?: string;
  backdropSizes?: Array<string>;
  logoSizes?: Array<string>;
  posterSizes?: Array<string>;
  profileSizes?: Array<string>;
  stillSizes?: Array<string>;
}

interface BaseImage {
  aspectRatio?: number;
  filePath?: string;
  height?: number;
  voteAverage?: number;
  voteCount?: number;
  width?: number;
}

export interface Logo extends BaseImage {
  id?: string;
  fileType?: ".svg" | ".png";
}

export interface Backdrop extends BaseImage {
  iso_639_1?: string;
}

export interface Profile extends BaseImage {
  iso_639_1?: string;
}

export interface Poster extends BaseImage {
  iso_639_1?: string;
}

export interface TitleLogo extends BaseImage {
  iso_639_1?: string;
}

export interface Keyword {
  id?: number;
  name?: string;
}

export interface ReleaseDate {
  certification?: string;
  descriptors?: string;
  iso_3166_1?: string;
  primary?: boolean;
  releaseDate?: string;
}

export interface Video {
  id?: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  key?: string;
  name?: string;
  official?: boolean;
  publishedAt?: string;
  site?: string;
  size?: 360 | 480 | 720 | 1080;
  type?:
    | "Trailer"
    | "Teaser"
    | "Clip"
    | "Featurette"
    | "Behind the Scenes"
    | "Bloopers";
}

export interface CreditsResponse extends Response {
  id?: number;
  cast?: Array<Cast>;
  crew?: Array<Crew>;
}

export interface Cast {
  adult?: boolean;
  castId?: number;
  character?: string;
  creditId?: string;
  gender?: number | null;
  id?: number;
  knownForDepartment?: string;
  name?: string;
  order?: number;
  originalName?: string;
  popularity?: number;
  profilePath?: string | null;
}

export interface Crew {
  adult?: boolean;
  creditId?: string;
  department?: string;
  gender?: number | null;
  id?: number;
  knownForDepartment?: string;
  job?: string;
  name?: string;
  originalName?: string;
  popularity?: number;
  profilePath?: string | null;
}

export interface Country {
  iso_3166_1?: string;
  englishName?: string;
}

export interface Language {
  iso_639_1?: string;
  englishName?: string;
  name?: string;
}

export interface Timezone {
  iso_3166_1?: string;
  zones?: string[];
}

export interface Job {
  department?: string;
  jobs?: string[];
}

export interface Episode {
  airDate?: string;
  crew?: Array<Crew>;
  episodeNumber?: number;
  guestStars?: GuestStar[];
  name?: string;
  overview?: string;
  id?: number;
  productionCode?: string | null;
  runtime?: number;
  seasonNumber?: number;
  stillPath?: string | null;
  voteAverage?: number;
  voteCount?: number;
}

export interface AggregateCreditsResponse extends Response {
  cast?: Array<AggregateCast>;
  crew?: Array<AggregateCrew>;
  id?: number;
}
export interface GuestStar {
  id?: number;
  name?: string;
  creditId?: string;
  character?: string;
  order?: number;
  profilePath?: string | null;
}

export interface AggregateCast {
  adult?: boolean;
  gender?: number;
  id?: number;
  knownForDepartment?: string;
  name?: string;
  originalName?: string;
  popularity?: number;
  profilePath?: string;
  roles?: Role[];
  totalEpisodeCount?: number;
  order?: number;
}

export interface AggregateJob {
  creditId?: string;
  job?: string;
  episodeCount?: number;
}

export interface AggregateCrew {
  adult?: boolean;
  gender?: number;
  id?: number;
  knownForDepartment?: string;
  name?: string;
  originalName?: string;
  popularity?: number;
  profilePath?: string;
  jobs?: AggregateJob[];
  department?: string;
  totalEpisodeCount?: number;
}

export interface SimpleEpisode {
  airDate?: string;
  episodeNumber?: number;
  id?: number;
  name?: string;
  order?: number;
  overview?: string;
  productionCode?: string;
  rating?: number;
  seasonNumber?: number;
  showId?: number;
  stillPath?: string;
  voteAverage?: number;
  voteCount?: number;
}

export interface Role {
  creditId?: string;
  character?: string;
  episodeCount?: number;
}

export interface MovieResponse extends Response {
  adult?: boolean;
  backdropPath: string;
  belongsToCollection?: string;
  budget?: number;
  genres: Array<Genre>;
  homepage?: string;
  id: number;
  imdbId?: string;
  originCountry?: string[];
  originalLanguage?: string;
  originalTitle?: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies?: Array<ProductionCompany>;
  productionCountries?: Array<ProductionCountry>;
  releaseDate?: string;
  revenue?: number;
  runtime?: number;
  spokenLanguages?: Array<SpokenLanguage>;
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
  tagline?: string;
  title: string;
  video?: boolean;
  voteAverage: number;
  voteCount: number;
}

export interface MovieResponseAppended extends MovieResponse {
  releases: {
    countries: Array<ReleaseDate>;
  };
  videos: VideosResponse;
  "watch/providers"?: WatchProviderResponse;
  mediaType: "movie"; // Not provided by api
  credits: CreditsResponse;
}

export interface ShowResponse extends Response {
  backdropPath?: string;
  createdBy?: Array<SimplePerson>;
  episodeRunTime?: number[];
  firstAirDate?: string;
  genres?: Array<Genre>;
  homepage?: string;
  id: number;
  inProduction?: boolean;
  languages?: string[];
  lastAirDate?: string;
  lastEpisodeToAir?: SimpleEpisode;
  name?: string;
  nextEpisodeToAir?: SimpleEpisode;
  networks?: Array<Network>;
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  originCountry?: string[];
  originalLanguage?: string;
  originalName?: string;
  overview?: string;
  popularity?: number;
  posterPath?: string;
  productionCompanies?: Array<ProductionCompany>;
  productionCountries?: Array<ProductionCountry>;
  seasons?: Array<SimpleSeason>;
  spokenLanguages?: Array<SpokenLanguage>;
  status?: string;
  tagline?: string;
  type?: string;
  voteAverage?: number;
  voteCount?: number;
  adult: boolean;
}

export interface ShowResponseAppended extends ShowResponse {
  contentRatings: {
    results: Array<RatingResponse>;
  };
  videos: VideosResponse;
  credits?: CreditsResponse;
  "watch/providers"?: WatchProviderResponse;
  mediaType: "tv"; // Not provided by api
  aggregateCredits?: AggregateCreditsResponse;
}

export interface VideosResponse extends Response {
  id?: number;
  results?: Array<Video>;
}

export interface WatchProviderResponse {
  id?: number;
  results?: {
    AR?: WatchProviderCountry;
    AT?: WatchProviderCountry;
    AU?: WatchProviderCountry;
    BE?: WatchProviderCountry;
    BR?: WatchProviderCountry;
    CA?: WatchProviderCountry;
    CH?: WatchProviderCountry;
    CL?: WatchProviderCountry;
    CO?: WatchProviderCountry;
    CZ?: WatchProviderCountry;
    DE?: WatchProviderCountry;
    DK?: WatchProviderCountry;
    EC?: WatchProviderCountry;
    EE?: WatchProviderCountry;
    ES?: WatchProviderCountry;
    FI?: WatchProviderCountry;
    FR?: WatchProviderCountry;
    GB?: WatchProviderCountry;
    GR?: WatchProviderCountry;
    HU?: WatchProviderCountry;
    ID?: WatchProviderCountry;
    IE?: WatchProviderCountry;
    IN?: WatchProviderCountry;
    IT?: WatchProviderCountry;
    JP?: WatchProviderCountry;
    KR?: WatchProviderCountry;
    LT?: WatchProviderCountry;
    LV?: WatchProviderCountry;
    MX?: WatchProviderCountry;
    MY?: WatchProviderCountry;
    NL?: WatchProviderCountry;
    NO?: WatchProviderCountry;
    NZ?: WatchProviderCountry;
    PE?: WatchProviderCountry;
    PH?: WatchProviderCountry;
    PL?: WatchProviderCountry;
    PT?: WatchProviderCountry;
    RO?: WatchProviderCountry;
    RU?: WatchProviderCountry;
    SE?: WatchProviderCountry;
    SG?: WatchProviderCountry;
    TH?: WatchProviderCountry;
    TR?: WatchProviderCountry;
    US?: WatchProviderCountry;
    VE?: WatchProviderCountry;
    ZA?: WatchProviderCountry;
  };
}

export interface WatchProviderCountry {
  link?: string;
  rent?: Array<WatchProvider>;
  buy?: Array<WatchProvider>;
  flatrate?: Array<WatchProvider>;
  ads?: Array<WatchProvider>;
  free?: Array<WatchProvider>;
}

export interface WatchProvider {
  displayPriority?: number;
  logoPath?: string;
  providerId?: number;
  providerName?: string;
}

export interface WatchProviderListResponse {
  results?: Array<WatchProvider>;
}

export interface SimpleSeason {
  airDate?: string;
  episodeCount?: number;
  id?: number;
  name?: string;
  overview?: string;
  posterPath?: string;
  seasonNumber?: number;
}

export interface SimplePerson {
  id?: number;
  creditId?: string;
  name?: string;
  gender?: number;
  profilePath?: string;
}

export interface Genre {
  id?: number;
  name?: string;
}

export interface ProductionCompany {
  name?: string;
  id?: number;
  logoPath?: string;
  originCountry?: string;
}

export interface ProductionCountry {
  name?: string;
  iso_3166_1?: string;
}

export interface SpokenLanguage {
  iso_639_1?: string;
  name?: string;
}
export interface RatingResponse {
  descriptors: Array<String>;
  iso_3166_1?: string;
  rating?: string;
}

export interface Network {
  name?: string;
  id?: number;
  logoPath?: string;
  originCountry?: string;
}
