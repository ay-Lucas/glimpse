import {
  Response,
  RequestParams,
  Genre,
  ProductionCountry,
  SpokenLanguage,
  ProductionCompany,
} from "./types";

export interface IdRequestParams extends RequestParams {
  id: string | number;
}

export interface AppendToResponseRequest {
  appendToResponse?: string;
}

export interface IdAppendToResponseRequest
  extends IdRequestParams,
    AppendToResponseRequest {}

export interface PagedRequestParams extends RequestParams {
  page?: number;
}

export interface IdPagedRequestParams extends IdRequestParams {
  page?: number;
}

export interface WatchProvidersParams extends RequestParams {
  watchRegion?: string;
}

export interface MovieResult {
  posterPath?: string;
  adult?: boolean;
  overview?: string;
  releaseDate?: string;
  genreIds?: Array<number>;
  id?: number;
  mediaType: "movie";
  originalTitle?: string;
  originalLanguage?: string;
  title?: string;
  backdropPath?: string;
  popularity?: number;
  voteCount?: number;
  video?: boolean;
  videos?: {
    results: Array<Video>;
  };
  voteAverage?: number;
}

export interface TvResult {
  posterPath?: string;
  popularity?: number;
  id?: number;
  overview?: string;
  backdropPath?: string;
  voteAverage?: number;
  mediaType: "tv";
  firstAirDate?: string;
  originCountry?: Array<string>;
  genreIds?: Array<number>;
  originalLanguage?: string;
  voteCount?: number;
  name?: string;
  originalName?: string;
  videos?: {
    results: Array<Video>;
  };
}

export interface PersonResult {
  profilePath?: string;
  adult?: boolean;
  id?: number;
  name?: string;
  mediaType: "person";
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
  placeOfBirth?: string | null;
  profilePath?: string | null;
  adult?: boolean;
  imdbId?: string;
  homepage?: null | string;
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

export interface Keyword {
  id?: number;
  name?: string;
}

export interface ReleaseDate {
  certification?: string;
  iso6391?: string;
  releaseDate?: string;
  type?: number;
  note?: string;
}

export interface Video {
  id?: string;
  iso6391?: string;
  iso31661?: string;
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

export interface Translation {
  iso31661?: string;
  iso6391?: string;
  name?: string;
  englishName?: string;
  data?: {
    name?: string;
    overview?: string;
    homepage?: string;
  };
}

export interface Company {
  description?: string;
  headquarters?: string;
  homepage?: string;
  id?: number;
  logoPath?: string;
  name?: string;
  originCountry?: string;
  parentCompany?: null | object;
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

export interface Network {
  name?: string;
  id?: number;
  logoPath?: string;
  originCountry?: string;
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

export enum ExternalId {
  imdbId = "imdb_id",
  freebaseMid = "freebase_mid",
  freebaseId = "freebase_id",
  tvdbId = "tvdb_id",
  tvrageId = "tvrage_id",
  facebookId = "facebook_id",
  twitterId = "twitter_id",
  instagramId = "instagram_id",
}

export interface ConfigurationResponse extends Response {
  changeKeys: string[];
  images: {
    baseUrl?: string;
    secureBaseUrl?: string;
    backdropSizes?: string[];
    logoSizes?: string[];
    posterSizes?: string[];
    profileSizes?: string[];
    stillSizes?: string[];
  };
}

export interface MovieList {
  description?: string;
  favoriteCount?: number;
  id?: number;
  itemCount?: number;
  iso6391?: string;
  listType?: string;
  name?: string;
  posterPath?: null | string;
}

export interface GuestStar {
  id?: number;
  name?: string;
  creditId?: string;
  character?: string;
  order?: number;
  profilePath?: string | null;
}

export interface Role {
  creditId?: string;
  character?: string;
  episodeCount?: number;
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

export interface FindRequest extends RequestParams {
  id: string | number;
  language?: string;
  externalSource?: ExternalId;
}

export interface PaginatedResponse extends Response {
  page?: number;
  totalResults?: number;
  totalPages?: number;
}

export interface FindResponse extends Response {
  movieResults: Array<MovieResult>;
  tvResults: Array<TvResult>;
  personResults: Array<PersonResult>;
  tvEpisodeResults: Array<EpisodeResult>;
  tvSeasonResults: Array<object>;
}

export interface SearchRequest extends RequestParams {
  query: string;
  page?: number;
}

export interface SearchCompanyResponse extends PaginatedResponse {
  results?: Array<{
    id?: number;
    logoPath?: string;
    name?: string;
  }>;
}

export interface SearchCollectionResponse extends PaginatedResponse {
  results?: Array<{
    id?: number;
    backdropPath?: string;
    name?: string;
    posterPath?: string;
  }>;
}

export interface SearchKeywordResponse extends PaginatedResponse {
  results?: Array<{
    id?: number;
    name?: string;
  }>;
}

export interface SearchMovieRequest extends SearchRequest {
  includeAdult?: boolean;
  region?: string;
  year?: number;
  primaryReleaseYear?: number;
}

export interface MovieResultsResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
}

export interface SearchMultiRequest extends SearchRequest {
  includeAdult?: boolean;
  region?: string;
}

export interface SearchMultiResponse extends PaginatedResponse {
  results?: Array<MovieResult | TvResult | PersonResult>;
}

export interface SearchPersonResponse extends PaginatedResponse {
  results?: Array<PersonResult>;
}

export interface SearchTvRequest extends SearchRequest {
  includeAdult?: boolean;
  firstAirDateYear?: number;
}

export interface EpisodeResultsResponse extends PaginatedResponse {
  results?: Array<SimpleEpisode>;
}

export interface CollectionRequest extends RequestParams {
  id: number;
}

export interface CollectionInfoResponse extends Response {
  id?: number;
  name?: string;
  overview?: string;
  posterPath?: null;
  backdropPath?: string;
  parts?: Array<{
    adult?: boolean;
    backdropPath?: null;
    genreIds?: number[];
    id?: number;
    originalLanguage?: string;
    originalTitle?: string;
    overview?: string;
    releaseDate?: string;
    posterPath?: string;
    popularity?: number;
    title?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
  }>;
}

export interface CollectionImagesResponse extends Response {
  id?: number;
  backdrops?: Array<Backdrop>;
  posters?: Array<Poster>;
}

export interface CollectionTranslationsResponse extends Response {
  id?: number;
  translations?: Array<Translation>;
}

export interface DiscoverMovieRequest extends RequestParams {
  region?: string;
  sortBy?:
    | "popularity.asc"
    | "popularity.desc"
    | "release_date.asc"
    | "release_date.desc"
    | "revenue.asc"
    | "revenue.desc"
    | "primary_release_date.asc"
    | "primary_release_date.desc"
    | "original_title.asc"
    | "original_title.desc"
    | "vote_average.asc"
    | "vote_average.desc"
    | "vote_count.asc"
    | "vote_count.desc";
  certificationCountry?: string;
  certification?: string;
  "certification.lte"?: string;
  "certification.gte"?: string;
  includeAdult?: boolean;
  includeVideo?: boolean;
  page?: number;
  primaryReleaseYear?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  withReleaseType?: string;
  year?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  withCast?: string;
  withCrew?: string;
  withPeople?: string;
  withCompanies?: string;
  withGenres?: string;
  withoutGenres?: string;
  withKeywords?: string;
  withoutKeywords?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  withOriginalLanguage?: string;
  withWatchProviders?: string;
  watchRegion?: string;
  withWatchMonetizationTypes?: string;
}

export interface DiscoverMovieResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
}

export interface DiscoverTvRequest extends RequestParams {
  sortBy?: string;
  "air_date.gte"?: string;
  "air_date.lte"?: string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  firstAirDateYear?: number;
  page?: number;
  timezone?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  withGenres?: string;
  withNetworks?: string;
  withoutGenres?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  includeNullFirstAirDates?: boolean;
  withOriginalLanguage?: string;
  withoutKeywords?: string;
  screenedTheatrically?: boolean;
  withCompanies?: string;
  withKeywords?: string;
  withWatchProviders?: string;
  watchRegion?: string;
  withWatchMonetizationTypes?: string;
}

export interface DiscoverTvResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface TrendingRequest extends RequestParams {
  mediaType: "all" | "movie" | "tv" | "person";
  timeWindow: "day" | "week";
}

export interface TrendingResponse extends PaginatedResponse {
  results: Array<MovieResult | TvResult | PersonResult>;
}

export interface MovieResponse extends Response {
  adult?: boolean;
  backdropPath?: string;
  belongsToCollection?: object;
  budget?: number;
  genres?: Array<Genre>;
  homepage?: string;
  id?: number;
  imdbId?: string;
  originalLanguage?: string;
  originalTitle?: string;
  overview?: string;
  popularity?: number;
  posterPath?: string;
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
  title?: string;
  video?: boolean;
  voteAverage: number;
  voteCount?: number;
}

export interface MovieAccountStateResponse extends Response {
  id?: number;
  favorite?: boolean;
  rated?: object | boolean;
  watchlist?: boolean;
}

export interface MovieAlternativeTitlesRequest extends IdRequestParams {
  country?: string;
}

export interface MovieAlternativeTitlesResponse extends Response {
  id?: number;
  titles?: Array<{
    iso31661?: string;
    title?: string;
    type?: string;
  }>;
}

export interface ChangesRequest extends IdRequestParams {
  startDate?: string;
  endDate?: string;
  page?: number;
}

export interface ChangesResponse extends PaginatedResponse {
  results?: Array<{
    id?: number;
    adult?: boolean | null;
  }>;
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

export interface WatchProviderResponse {
  id?: number;
  results?: {
    ar?: WatchProviderCountry;
    at?: WatchProviderCountry;
    au?: WatchProviderCountry;
    be?: WatchProviderCountry;
    br?: WatchProviderCountry;
    ca?: WatchProviderCountry;
    ch?: WatchProviderCountry;
    cl?: WatchProviderCountry;
    co?: WatchProviderCountry;
    cz?: WatchProviderCountry;
    de?: WatchProviderCountry;
    dk?: WatchProviderCountry;
    ec?: WatchProviderCountry;
    ee?: WatchProviderCountry;
    es?: WatchProviderCountry;
    fi?: WatchProviderCountry;
    fr?: WatchProviderCountry;
    gb?: WatchProviderCountry;
    gr?: WatchProviderCountry;
    hu?: WatchProviderCountry;
    id?: WatchProviderCountry;
    ie?: WatchProviderCountry;
    in?: WatchProviderCountry;
    it?: WatchProviderCountry;
    jp?: WatchProviderCountry;
    kr?: WatchProviderCountry;
    lt?: WatchProviderCountry;
    lv?: WatchProviderCountry;
    mx?: WatchProviderCountry;
    my?: WatchProviderCountry;
    nl?: WatchProviderCountry;
    no?: WatchProviderCountry;
    nz?: WatchProviderCountry;
    pe?: WatchProviderCountry;
    ph?: WatchProviderCountry;
    pl?: WatchProviderCountry;
    pt?: WatchProviderCountry;
    ro?: WatchProviderCountry;
    ru?: WatchProviderCountry;
    se?: WatchProviderCountry;
    sg?: WatchProviderCountry;
    th?: WatchProviderCountry;
    tr?: WatchProviderCountry;
    us?: WatchProviderCountry;
    ve?: WatchProviderCountry;
    za?: WatchProviderCountry;
  };
}

export interface MovieChangesResponse extends Response {
  changes?: Array<{
    key?: string;
    items?: Array<{
      id?: string;
      action?: string;
      time?: string;
      iso6391?: string;
      value?: string;
      originalValue?: string;
    }>;
  }>;
}

export interface CreditsResponse extends Response {
  id?: number;
  cast?: Array<Cast>;
  crew?: Array<Crew>;
}

export interface AggregateCreditsResponse extends Response {
  cast?: Array<AggregateCast>;
  crew?: Array<AggregateCrew>;
  id?: number;
}

export interface MovieExternalIdsResponse extends Response {
  imdbId?: string | null;
  facebookId?: string | null;
  instagramId?: string | null;
  twitterId?: string | null;
  id?: number;
}

export interface MovieImagesRequest extends IdRequestParams {
  includeImageLanguage?: string;
}

export interface MovieImagesResponse extends Response {
  id?: number;
  backdrops?: Array<Backdrop>;
  posters?: Array<Poster>;
  logos?: Array<TitleLogo>;
}

export interface MovieKeywordResponse extends Response {
  id?: number;
  keywords?: Array<Keyword>;
}

export interface MovieReleaseDatesResponse extends Response {
  id?: number;
  results?: Array<{
    iso31661?: string;
    releaseDates?: Array<ReleaseDate>;
  }>;
}

export interface VideosResponse extends Response {
  id?: number;
  results?: Array<Video>;
}

export interface MovieTranslationsResponse
  extends CollectionTranslationsResponse {}

export interface MovieRecommendationsRequest extends IdRequestParams {
  page?: string;
}

export interface MovieRecommendationsResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
}

export interface SimilarMovieResponse extends MovieRecommendationsResponse {}

export interface MovieReviewsRequest extends MovieRecommendationsRequest {}

export interface MovieReviewsResponse extends PaginatedResponse {
  results?: Array<Review>;
}

export interface MovieListsRequest extends MovieRecommendationsRequest {}

export interface MovieListsResponse extends PaginatedResponse {
  results?: Array<MovieList>;
}

export interface RatingRequest extends IdRequestParams {
  value: number;
}

export interface PostResponse extends Response {
  statusCode?: number;
  statusMessage?: string;
}

export interface MovieNowPlayingRequest {
  language?: string;
  page?: number;
  region?: string;
}

export interface MovieNowPlayingResponse extends PaginatedResponse {
  results?: Array<MovieResult>;
  dates?: {
    maximum?: string;
    minimum?: string;
  };
}

export interface PopularMoviesRequest extends MovieNowPlayingRequest {}

export interface PopularMoviesResponse extends DiscoverMovieResponse {}

export interface TopRatedMoviesRequest extends MovieNowPlayingRequest {}

export interface TopRatedMoviesResponse extends DiscoverMovieResponse {}

export interface UpcomingMoviesRequest extends MovieNowPlayingRequest {
  page?: number;
  region?: string;
}

export interface UpcomingMoviesResponse extends MovieNowPlayingResponse {
  results: Array<MovieResult>;
  dates?: {
    maximum?: string;
    minimum?: string;
  };
}

export interface ShowResponse extends Response {
  backdropPath?: string | null;
  createdBy?: Array<SimplePerson>;
  episodeRunTime?: number[];
  firstAirDate?: string;
  genres?: Array<Genre>;
  homepage?: string;
  id?: number;
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
  posterPath?: string | null;
  productionCompanies?: Array<ProductionCompany>;
  productionCountries?: Array<ProductionCountry>;
  seasons?: Array<SimpleSeason>;
  spokenLanguages?: Array<SpokenLanguage>;
  status?: string;
  tagline?: string;
  type?: string;
  voteAverage: number;
  voteCount?: number;
}

export interface ShowAccountStatesResponse extends Response {
  id?: number;
  favorite?: boolean;
  rated?: object | boolean;
  watchlist?: boolean;
}

export interface ShowAlternativeTitlesResponse extends Response {
  id?: number;
  results?: Array<{
    title?: string;
    iso31661?: string;
    type?: string;
  }>;
}

export interface ShowChangesResponse extends Response {
  id?: number;
  results?: Array<{
    title?: string;
    iso31661?: string;
    type?: string;
  }>;
}

export interface RatingResponse {
  iso31661?: string;
  rating?: string;
}

export interface ShowContentRatingResponse extends Response {
  results?: Array<RatingResponse>;
  id?: number;
}

export interface TvEpisodeGroupsResponse extends Response {
  results?: Array<{
    description?: string;
    episodeCount?: number;
    groupCount?: number;
    id?: string;
    name?: string;
    network?: null | Network;
  }>;
}

export interface TvExternalIdsResponse extends Response {
  imdbId?: string | null;
  freebaseMid?: string | null;
  freebaseId?: string | null;
  tvdbId?: number | null;
  tvrageId?: number | null;
  facebookId?: string | null;
  instagramId?: string | null;
  twitterId?: string | null;
  id?: number;
}

export interface TvImagesResponse extends Response {
  backdrops?: Array<Backdrop>;
  id?: number;
  posters?: Array<Poster>;
  logos?: Array<TitleLogo>;
}

export interface TvKeywordsResponse extends Response {
  id?: number;
  results?: Array<Keyword>;
}

export interface TvResultsResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface TvReviewsResponse extends PaginatedResponse {
  results?: Array<Review>;
}

export interface TvScreenTheatricallyResponse extends Response {
  id?: number;
  results?: Array<{
    id?: number;
    episodeNumber?: number;
    seasonNumber?: number;
  }>;
}

export interface TvSimilarShowsResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface TvTranslationsResponse extends Response {
  id?: number;
  translations?: Array<Translation>;
}

export interface TvSeasonRequest extends IdAppendToResponseRequest {
  seasonNumber: number;
}

export interface TvAggregateCreditsRequest {
  id: number;
  seasonNumber: number;
  language?: string;
}

export interface TvSeasonResponse extends Response {
  _id?: string;
  airDate?: string;
  episodes?: Array<Episode>;
  name?: string;
  overview?: string;
  id?: number;
  posterPath?: string | null;
  seasonNumber?: number;
}

export interface TvRecommendationsRequest extends IdRequestParams {
  page?: string;
}

export interface TvRecommendationsResponse extends PaginatedResponse {
  results?: Array<TvResult>;
}

export interface SimilarTvResponse extends TvRecommendationsResponse {}

export interface TvReviewsRequest extends TvRecommendationsRequest {}

export interface TvReviewsResponse extends PaginatedResponse {
  results?: Array<Review>;
}

export interface MovieListsRequest extends MovieRecommendationsRequest {}
export interface TvSeasonChangesResponse extends Response {
  changes?: Array<{
    key?: string;
    items?: Array<{
      id?: string;
      action?: string;
      time?: string;
      value?:
        | string
        | {
            episodeId?: number;
            episodeNumber?: number;
          };
      iso6391?: string;
      originalValue?: string;
    }>;
  }>;
}

export interface TvSeasonAccountStatesResponse extends Response {
  id?: number;
  results?: Array<{
    id?: number;
    episodeNumber?: number;
    rated?:
      | boolean
      | {
          value?: number;
        };
  }>;
}

export interface TvSeasonExternalIdsResponse extends Response {
  freebaseMid?: string | null;
  freebaseId?: null | string;
  tvdbId?: number | null;
  tvrageId?: null | number;
  id?: number;
}

export interface TvSeasonImagesResponse extends Response {
  id?: number;
  posters?: Array<Poster>;
}

export interface EpisodeRequest extends TvSeasonRequest {
  episodeNumber: number;
}

export interface EpisodeChangesResponse extends Response {
  changes?: Array<{
    key?: string;
    items?: Array<{
      id?: string;
      action?: string;
      time?: string;
      value?: string;
      iso6391?: string;
    }>;
  }>;
}

export interface EpisodeAccountStatesResponse extends Response {
  id?: number;
  rated?: object | boolean;
}

export interface EpisodeCreditsResponse extends CreditsResponse {
  guestStars?: Array<GuestStar>;
}

export interface EpisodeExternalIdsResponse extends Response {
  imdbId?: string | null;
  freebaseMid?: string | null;
  freebaseId?: string | null;
  tvdbId?: number | null;
  tvrageId?: number | null;
  id?: number;
}

interface EpisodeImage extends BaseImage {
  iso6391?: null | string;
}

export interface EpisodeImagesResponse extends Response {
  id?: number;
  stills?: Array<EpisodeImage>;
}

export interface EpisodeTranslationsResponse extends Response {
  id?: number;
  translations?: Array<{
    iso31661?: string;
    iso6391?: string;
    name?: string;
    englishName?: string;
    data?: {
      name?: string;
      overview?: string;
    };
  }>;
}

export interface EpisodeRatingRequest extends EpisodeRequest {
  value: number;
}

export interface EpisodeVideosResponse extends Response {
  id?: number;
  results: Array<{
    id?: string;
    iso6391?: string;
    iso31661?: string;
    key?: string;
    name?: string;
    site?: string;
    size?: 360 | 480 | 720 | 1080;
    type?:
      | "Trailer"
      | "Teaser"
      | "Clip"
      | "Featurette"
      | "Opening Credits"
      | "Behind the Scenes"
      | "Bloopers"
      | "Recap";
  }>;
}

export interface PersonChangesResponse extends Response {
  changes: Array<{
    key?: string;
    items?: Array<{
      id?: string;
      action?: string;
      time?: string;
      originalValue?: {
        profile?: {
          filePath?: string;
        };
      };
    }>;
  }>;
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
    id?: number;
    backdropPath?: string | null;
    overview?: string;
    posterPath?: string | null;
  }>;
  crew?: Array<{
    id?: number;
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
    id?: number;
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
    id?: number;
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

export interface PersonCombinedCreditsResponse extends Response {
  id?: number;
  cast?: Array<{
    id?: number;
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
  }>;
  crew?: Array<{
    id?: number;
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
  }>;
}

export interface PersonExternalIdsResponse extends Response {
  imdbId?: string | null;
  facebookId?: null | string;
  freebaseMid?: string | null;
  freebaseId?: null | string;
  tvrageId?: number | null;
  twitterId?: null | string;
  id: number;
  instagramId?: string | null;
}

export interface PersonImagesResponse extends Response {
  id?: number;
  profiles?: Array<Profile>;
}

interface PersonTaggedImage extends BaseImage {
  id?: string;
  iso6391?: null | string;
  imageType?: string;
  media?: MovieResult | TvResult;
}

export interface PersonTaggedImagesResponse extends PaginatedResponse {
  id?: number;
  results?: Array<PersonTaggedImage>;
}

export interface PersonTranslationsResponse extends PaginatedResponse {
  id?: number;
  translations?: Array<{
    iso6391?: string;
    iso31661?: string;
    name?: string;
    data?: {
      biography?: string;
    };
    englishName?: string;
  }>;
}

export interface PersonPopularResponse extends PaginatedResponse {
  results?: Array<{
    profilePath?: string;
    adult?: boolean;
    id?: number;
    knownFor?: MovieResult | TvResult;
    name?: string;
    popularity?: number;
  }>;
}

export interface CreditDetailsResponse extends Response {
  creditType?: string;
  department?: string;
  job?: string;
  media?: {
    id?: number;
    name?: string;
    originalName?: string;
    character?: string;
    episodes?: Array<SimpleEpisode>;
    seasons?: Array<{
      airDate?: string;
      posterPath?: string;
      seasonNumber?: number;
    }>;
  };
  mediaType?: string;
  id?: string;
  person?: {
    name?: string;
    id?: number;
  };
}

export interface ListsDetailResponse extends Response {
  createdBy?: string;
  description?: string;
  favoriteCount?: number;
  id?: string;
  items?: Array<MovieResult>;
  itemCount?: number;
  iso6391?: string;
  name?: string;
  posterPath?: string | null;
}

export interface ListStatusParams extends RequestParams {
  id: string | number;
  movieId: number;
}

export interface ListsStatusResponse extends Response {
  id?: string;
  itemPresent?: boolean;
}

export interface CreateListParams extends RequestParams {
  name?: string;
  description?: string;
  language?: string;
}

export interface CreateListResponse extends Response {
  statusMessage?: string;
  success?: boolean;
  statusCode?: number;
  listId?: number;
}

export interface CreateListItemParams extends IdRequestParams {
  mediaId: number;
}

export interface ClearListParams extends IdRequestParams {
  confirm: boolean;
}

export interface GenresResponse extends Response {
  genres?: Array<Genre>;
}

export interface KeywordResponse extends Response {
  id?: number;
  name?: string;
}

export interface KeywordMoviesParams extends IdRequestParams {
  includeAdult?: boolean;
}

export interface CompanyAlternativeNamesResponse extends Response {
  id?: number;
  results?: Array<{
    name?: string;
    type?: string;
  }>;
}

export interface CompanyImagesResponse extends Response {
  id?: number;
  logos?: Array<Logo>;
}

export interface AccountInfoResponse extends Response {
  id?: number;
  avatar?: {
    gravatar?: {
      hash?: string;
    };
  };
  iso6391?: string;
  iso31661?: string;
  name?: string;
  includeAdult?: boolean;
  username?: string;
}

export interface AccountListsResponse extends PaginatedResponse {
  results?: Array<{
    description?: string;
    favoriteCount?: number;
    id?: number;
    itemCount?: number;
    iso6391?: string;
    listType?: string;
    name?: string;
    posterPath?: null;
  }>;
}

export interface AccountMediaRequest extends PagedRequestParams {
  sortBy?: "created_at.asc" | "created_at.desc";
}

export interface MarkAsFavoriteRequest extends IdRequestParams {
  mediaType: "movie" | "tv";
  mediaId: number;
  favorite: boolean;
}

export interface AccountWatchlistRequest extends IdRequestParams {
  mediaType: "movie" | "tv";
  mediaId: number;
  watchlist: boolean;
}

export interface Certification {
  certification?: string;
  meaning?: string;
  order?: number;
}

export interface CertificationsResponse extends Response {
  certifications?: {
    us?: Certification[];
    ca?: Certification[];
    de?: Certification[];
    gb?: Certification[];
    au?: Certification[];
    br?: Certification[];
    fr?: Certification[];
    nz?: Certification[];
    in?: Certification[];
  };
}

export type CountriesResponse = Array<Country>;

export interface NetworkResponse extends Response {
  headquarters?: string;
  homepage?: string;
  id?: number;
  name?: string;
  originCountry?: string;
}

export interface Review {
  id?: string;
  author?: string;
  content?: string;
  iso6391?: string;
  mediaId?: number;
  mediaTitle?: string;
  mediaType?: string;
  url?: string;
}

export interface EpisodeGroupResponse extends Response {
  id?: string;
  name?: string;
  description?: string;
  episodeCount?: number;
  groupCount?: number;
  groups?: Array<{
    id?: string;
    name?: string;
    order?: number;
    locked?: boolean;
    episodes?: Array<SimpleEpisode>;
  }>;
  network?: Network;
  type?: number;
}
