import { Response } from "./types";

/* ────────────────────  Search / Movie / TV Results ──────────────────── */

export interface MovieResult {
  adult: boolean;
  backdropPath: string;
  genreIds?: number[];
  id: number;
  originCountry: string[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate?: string | null;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export interface TvResult {
  adult: boolean;
  backdropPath: string;
  genreIds?: number[];
  id: number;
  originCountry: string[];
  originalLanguage: string;
  originalName: string;
  overview: string;
  popularity: number;
  posterPath: string;
  firstAirDate?: string | null | Date;
  name: string;
  voteAverage: number;
  voteCount: number;
}

export interface PersonResult {
  profilePath?: string;
  adult?: boolean;
  id?: number;
  name?: string;
  mediaType: "person"; // Not provided by API
  popularity?: number;
  knownFor?: Array<MovieResult | TvResult>;
}

export interface EpisodeResult extends SimpleEpisode {
  mediaType: "tv_episode";
  runtime?: string;
}

/* ─────────────────────────────  People  ────────────────────────────── */

export interface Person {
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

/* ─────────────────────────────  Images  ────────────────────────────── */

export interface Image {
  baseUrl?: string;
  secureBaseUrl?: string;
  backdropSizes?: string[];
  logoSizes?: string[];
  posterSizes?: string[];
  profileSizes?: string[];
  stillSizes?: string[];
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
  iso6391?: string;
}

export interface Profile extends BaseImage {
  iso6391?: string;
}

export interface Poster extends BaseImage {
  iso6391?: string;
}

export interface TitleLogo extends BaseImage {
  iso6391?: string;
}

/* ─────────────────────────  Keywords / Dates  ───────────────────────── */

export interface Keyword {
  id?: number;
  name?: string;
}

export interface ReleasesReleaseDate {
  certification: string;
  descriptors: string;
  iso31661: string;
  primary: boolean;
  releaseDate: string;
}

export interface ReleaseDate {
  certification: string;
  descriptors: string[];
  iso6391: string;
  note: string;
  releaseDate: string;
  type: number;
}

/* ─────────────────────────────  Videos  ────────────────────────────── */

export interface Video {
  id: string;
  iso6391: string;
  iso31661: string;
  key: string;
  name: string;
  official: boolean;
  publishedAt: string;
  site: string;
  size: 360 | 480 | 720 | 1080;
  type:
    | "Trailer"
    | "Teaser"
    | "Clip"
    | "Featurette"
    | "Behind the Scenes"
    | "Bloopers";
}

/* ─────────────────────────────  Credits  ───────────────────────────── */

export interface CreditsResponse extends Response {
  id: number;
  cast: Cast[];
  crew: Crew[];
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

/* ───────────────────────  Configuration Lists  ─────────────────────── */

export interface Country {
  iso31661?: string;
  englishName?: string;
}

export interface Language {
  iso6391?: string;
  englishName?: string;
  name?: string;
}

export interface Timezone {
  iso31661?: string;
  zones?: string[];
}

export interface Job {
  department?: string;
  jobs?: string[];
}

/* ─────────────────────────────  Episodes  ──────────────────────────── */

export interface Episode {
  airDate?: string;
  crew?: Crew[];
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

/* ────────────────────────  Aggregate Credits  ──────────────────────── */

export interface AggregateCreditsResponse extends Response {
  cast: AggregateCast[];
  crew: AggregateCrew[];
  id: number;
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
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string;
  roles: Role[];
  totalEpisodeCount: number;
  order: number;
}

export interface AggregateJob {
  creditId: string;
  job: string;
  episodeCount: number;
}

export interface AggregateCrew {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string;
  jobs: AggregateJob[];
  department: string;
  totalEpisodeCount: number;
}

/* ─────────────────────────  Simple Episode  ────────────────────────── */

export interface SimpleEpisode {
  airDate?: string;
  episodeNumber?: number;
  id: number;
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

/* ─────────────────────────  Movie Response  ────────────────────────── */

export interface MovieResponse extends Response {
  adult?: boolean;
  backdropPath: string;
  belongsToCollection?: string;
  budget?: number;
  genres: Genre[];
  homepage?: string;
  id: number;
  imdbId?: string;
  originCountry?: string[];
  originalLanguage?: string;
  originalTitle?: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies?: ProductionCompany[];
  productionCountries?: ProductionCountry[];
  releaseDate?: string;
  revenue?: number;
  runtime?: number;
  spokenLanguages?: SpokenLanguage[];
  status:
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
  releases: { countries: ReleasesReleaseDate[] };
  videos: VideosResponse;
  "watch/providers"?: WatchProviderResponse;
  mediaType: "movie"; // Not provided by API
  credits: CreditsResponse;
}

/* ───────────────────────────  Show Response  ───────────────────────── */

export interface ShowResponse extends Response {
  backdropPath?: string;
  createdBy?: SimplePerson[];
  episodeRunTime?: number[];
  firstAirDate?: string;
  genres?: Genre[];
  homepage?: string;
  id: number;
  inProduction?: boolean;
  languages?: string[];
  lastAirDate?: string;
  lastEpisodeToAir?: SimpleEpisode;
  name?: string;
  nextEpisodeToAir?: SimpleEpisode;
  networks?: Network[];
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  originCountry?: string[];
  originalLanguage?: string;
  originalName?: string;
  overview?: string;
  popularity?: number;
  posterPath?: string;
  productionCompanies?: ProductionCompany[];
  productionCountries?: ProductionCountry[];
  seasons?: SimpleSeason[];
  spokenLanguages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  type?: string;
  voteAverage?: number;
  voteCount?: number;
  adult: boolean;
}

export interface ShowResponseAppended extends ShowResponse {
  contentRatings: { results: RatingResponse[] };
  videos: VideosResponse;
  credits?: CreditsResponse;
  "watch/providers"?: WatchProviderResponse;
  mediaType: "tv"; // Not provided by API
  aggregateCredits?: AggregateCreditsResponse;
}

/* ───────────────────────────  Video Lists  ─────────────────────────── */

export interface VideosResponse extends Response {
  id: number;
  results: Video[];
}

/* ────────────────────────  Watch Providers  ────────────────────────── */

export interface WatchProviderResponse {
  id: number;
  results: {
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
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  flatrate?: WatchProvider[];
  ads?: WatchProvider[];
  free?: WatchProvider[];
}

export interface WatchProvider {
  displayPriority: number;
  logoPath: string;
  providerId: number;
  providerName: string;
}

export interface WatchProviderListResponse {
  results: WatchProvider[];
}

/* ───────────────────────────  Misc Models  ─────────────────────────── */

export interface SimpleSeason {
  airDate?: string;
  episodeCount?: number;
  id?: number;
  name?: string;
  overview?: string;
  posterPath?: string;
  seasonNumber?: number;
  voteAverage?: number;
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
  iso31661?: string;
}

export interface SpokenLanguage {
  iso6391?: string;
  name?: string;
}

export interface RatingResponse {
  descriptors: Array<String>;
  iso31661: string;
  rating: string;
}

export interface MovieRatingResponse {
  descriptors: Array<String>;
  iso31661?: string;
  certification?: string;
}

export interface ShowContentRatingResponse extends Response {
  results: Array<RatingResponse>;
  id: number;
}

export interface Network {
  name?: string;
  id?: number;
  logoPath?: string;
  originCountry?: string;
}

export interface UpcomingMoviesResponse extends MovieNowPlayingResponse {
  results?: Array<MovieResult>;
  dates?: {
    maximum?: string;
    minimum?: string;
  };
}

export interface MovieNowPlayingResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
  dates?: {
    maximum?: string;
    minimum?: string;
  };
}

export interface PaginatedResponse extends Response {
  page?: number;
  totalResults: number;
  totalPages: number;
}

export interface PopularMoviesResponse extends DiscoverMovieResponse {}

export interface DiscoverMovieResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
  credits?: CreditsResponse;
}

export interface PopularTvResponse extends DiscoverTvResponse {}

export interface DiscoverTvResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface PersonCastCredit {
  id: number;
  originalLanguage?: string;
  episodeCount?: number;
  overview?: string;
  originCountry?: string[];
  originalName?: string;
  genreIds?: number[];
  name?: string;
  mediaType?: string;
  posterPath?: string | null;
  firstAirDate?: string;
  voteAverage?: number | number;
  voteCount?: number;
  character?: string;
  backdropPath?: string | null;
  popularity?: number;
  creditId?: string;
  originalTitle?: string;
  video?: boolean;
  releaseDate?: string;
  title?: string;
  adult?: boolean;
  order?: number;
}

export interface PersonCrewCredit {
  id: number;
  department?: string;
  originalLanguage?: string;
  episodeCount?: number;
  job?: string;
  overview?: string;
  originCountry?: string[];
  originalName?: string;
  voteCount?: number;
  name?: string;
  mediaType?: string;
  popularity?: number;
  creditId?: string;
  backdropPath?: string | null;
  firstAirDate?: string;
  voteAverage?: number;
  genreIds?: number[];
  posterPath?: string | null;
  originalTitle?: string;
  video?: boolean;
  title?: string;
  adult?: boolean;
  releaseDate?: string;
}

export interface PersonCombinedCreditsResponse extends Response {
  id?: number;
  cast?: Array<PersonCastCredit>;
  crew?: Array<PersonCrewCredit>;
}

export interface PersonMovieCreditsResponse extends Response {
  id?: number;
  cast?: Array<{
    character?: string;
    creditId?: string;
    releaseDate?: string;
    voteCount?: number;
    video?: boolean;
    adult?: boolean;
    voteAverage?: number | number;
    title?: string;
    genreIds?: number[];
    originalLanguage?: string;
    originalTitle?: string;
    popularity?: number;
    id: number;
    backdropPath?: string | null;
    overview?: string;
    posterPath?: string | null;
  }>;
  crew?: Array<{
    id: number;
    department?: string;
    originalLanguage?: string;
    originalTitle?: string;
    job?: string;
    overview?: string;
    voteCount?: number;
    video?: boolean;
    posterPath?: string | null;
    backdropPath?: string | null;
    title?: string;
    popularity?: number;
    genreIds?: number[];
    voteAverage?: number;
    adult?: boolean;
    releaseDate?: string;
    creditId?: string;
  }>;
}

export interface PersonTvCreditsResponse extends Response {
  id?: number;
  cast?: Array<{
    creditId?: string;
    originalName?: string;
    id: number;
    genreIds?: number[];
    character?: string;
    name?: string;
    posterPath?: string | null;
    voteCount?: number;
    voteAverage?: number;
    popularity?: number;
    episodeCount?: number;
    originalLanguage?: string;
    firstAirDate?: string;
    backdropPath?: string | null;
    overview?: string;
    originCountry?: string[];
  }>;
  crew?: Array<{
    id: number;
    department?: string;
    originalLanguage?: string;
    episodeCount?: number;
    job?: string;
    overview?: string;
    originCountry?: string[];
    originalName?: string;
    genreIds?: number[];
    name?: string;
    firstAirDate?: string;
    backdropPath?: string | null;
    popularity?: number;
    voteCount?: number;
    voteAverage?: number;
    posterPath?: string | null;
    creditId?: string;
  }>;
}

export interface PersonImagesResponse extends Response {
  id?: number;
  profiles?: Array<Profile>;
}

export interface PersonTaggedImage extends BaseImage {
  id?: number;
  iso6391?: string | null;
  imageType?: string;
  media?: MovieResult | TvResult | EpisodeResult;
  mediaType: "episode" | "movie" | "tv";
}

export interface PersonTaggedImagesResponse extends PaginatedResponse {
  id?: number;
  results?: Array<PersonTaggedImage>;
}

export interface SearchPersonResponse extends PaginatedResponse {
  results?: Array<PersonResult>;
}

export interface TvExternalIdsResponse extends Response {
  imdbId: string | null;
  freebaseMid: string | null;
  freebaseId: string | null;
  tvdbId: number | null;
  tvrageId: number | null;
  facebookId: string | null;
  instagramId: string | null;
  twitterId: string | null;
  wikidataId: string | null;
  id: number;
}

export interface MovieExternalIdsResponse extends Response {
  imdbId?: string | null;
  facebookId?: string | null;
  instagramId?: string | null;
  twitterId?: string | null;
  wikidataId?: string | null;
  id?: number;
}

export interface PersonExternalIdsResponse extends Response {
  imdbId?: string | null;
  wikidataId?: string | null;
  tiktokId?: string | null;
  twitterId?: string | null;
  instagramId?: string | null;
  facebookId?: string | null;
  youtubeId?: string | null;
  freebaseMid?: string | null;
  freebaseId?: string | null;
  tvrageId?: number | null;
  id: number;
}

export interface TvImagesResponse extends Response {
  backdrops: Array<Backdrop>;
  id: number;
  posters: Array<Poster>;
  logos: Array<TitleLogo>;
}

export interface MovieImagesResponse extends Response {
  id?: number;
  backdrops?: Array<Backdrop>;
  posters?: Array<Poster>;
  logos?: Array<TitleLogo>;
}

export interface MovieResultsResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
}

export interface TvResultsResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface MovieReleaseDatesResponse extends Response {
  id: number;
  results: Array<{
    iso31661: string;
    releaseDates: Array<ReleaseDate>;
  }>;
}

export interface SimilarMovieResponse extends MovieRecommendationsResponse {}

export interface MovieRecommendationsResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
}

export interface SimilarShowsResponse extends PaginatedResponse {
  results: Array<TvResult>;
}
