"server only";
import { db } from "@/db";
import {
  movieDetails,
  movieSummaries,
  tvDetails,
  tvSummaries,
} from "@/db/schema";
import { getWatchlistsAndItems } from "@/lib/actions";
import { BASE_API_URL, DISCOVER_LIMIT, options } from "@/lib/constants";
import { FullMovie, FullTv } from "@/types/camel-index";
import {
  MovieContentRatingResponse,
  MovieResponseAppended,
  MovieResultsResponse,
  MovieReviewsResponse,
  Person,
  ReleaseDate,
  ShowContentRatingResponse,
  ShowResponseAppended,
  TvResultsResponse,
  TvReviewsResponse,
  TvSeasonResponse,
} from "@/types/request-types-snakecase";
import {
  CreditsResponse,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SimplePerson,
  SpokenLanguage,
  WatchProviderResponse,
  Network,
  SimpleSeason,
  AggregateCreditsResponse,
  RatingResponse,
  VideosResponse,
  MovieResult,
  TvResult,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { DiscoverItem, fetchTmdbMovieLists, fetchTmdbTvLists, getPopularMovies, getPopularSeries, getTrendingMovies, getTrendingSeries, getUpcomingMovieSummaries } from "@/app/discover/actions";

export async function getPersonDetails(
  id: number,
  resOptions: RequestInit = options,
): Promise<Person> {
  const res = await fetch(`${BASE_API_URL}/person/${id}`, resOptions);
  return res.json();
}

export const fetchTvDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullTv> => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/tv/${id}?append_to_response=videos,releases,content_ratings,credits,aggregate_credits,episode_groups,watch/providers&language=en-US`,
      resOptions,
    );
    const data = await res.json();

    // data.watchProviders = watchProviders;
    let dataFixed = {
      ...data,
      watchProviders: data["watch/providers"]
    };
    delete dataFixed["watch/providers"];
    // camelCase everything else
    const camel = camelcaseKeys<Record<string, unknown>>(dataFixed, {
      deep: true,
      exclude: [/^[A-Z]{2}$/]
    }) as FullTv;

    // fix up dates, etc…
    if (camel.firstAirDate) camel.firstAirDate = new Date(camel.firstAirDate);
    camel.tmdbId = camel.id;
    camel.id = -1;
    return camel as FullTv;
  } catch (err) {
    console.error("fetchTvDetails failed for,", id, err)
    throw err;
  }
}, [],
  {
    revalidate: 36000,  // 10 hours
  }
);

export const fetchMovieDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullMovie> => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/movie/${id}` +
      `?append_to_response=videos,releases,content_ratings,credits,aggregate_credits,` +
      `episode_groups,watch/providers&language=en-US`,
      resOptions,
    );
    const data = await res.json();

    // data.watchProviders = watchProviders;
    let dataFixed = {
      ...data,
      watchProviders: data["watch/providers"]
    };

    delete dataFixed["watch/providers"];

    // camelCase everything else
    const camel = camelcaseKeys<Record<string, unknown>>(dataFixed, {
      deep: true,
      exclude: [/^[A-Z]{2}$/]
    }) as FullMovie;

    // fix up dates, etc…
    if (camel.releaseDate) camel.releaseDate = new Date(camel.releaseDate);
    return camel as FullMovie;
  } catch (err) {
    console.error("fetchMovieDetails failed for,", id, err)
    throw err;
  }
}, [],
  {
    revalidate: 36000,  // 10 hours
  }
)

export async function getReviews(
  type: "tv" | "movie",
  id: number,

  resOptions: RequestInit = options,
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(`${BASE_API_URL}/${type}/${id}/reviews`, resOptions);
  return res.json();
}

export async function getRecommendations(
  id: number,
  type: "tv" | "movie",
  resOptions: RequestInit = options,
): Promise<MovieResultsResponse | TvResultsResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/recommendations`,
      resOptions,
    );
    return res.json();
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} with id: ${id}`);
  }
}

export async function getContentRating(
  type: "tv" | "movie",
  id: number,
  resOptions: RequestInit = options,
): Promise<ShowContentRatingResponse | MovieContentRatingResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
      resOptions,
    );
    return res.json();
  } catch (error) {
    console.error("Error fetching content ratings");
  }
}

export async function getSeasonData(
  id: number,
  seasonNumber: number,
  resOptions: RequestInit = options,
): Promise<TvSeasonResponse> {
  const res = await fetch(
    `${BASE_API_URL}/tv/${id}/season/${seasonNumber}`,
    resOptions,
  );
  return res.json();
}

export async function getWatchlistsWithItem(
  watchlistItem: ShowResponseAppended | MovieResponseAppended,
  userId: string,
) {
  const watchlists = await getWatchlistsAndItems(userId);
  // const watchlistsWithItem = watchlists.map((watchlist) => {
  //   if (watchlist.items.some((item) => item.tmdbId === watchlistItem.tmdbId)) {
  //     return watchlist;
  //   }
  // });
  const watchlistsWithItem = watchlists.filter((watchlist) =>
    watchlist.items.some((item) => item.tmdbId === watchlistItem.id),
  );
  if (watchlistsWithItem.length < 1) return undefined;
  return watchlistsWithItem;
}

export const getFullMovie = unstable_cache(async (tmdbId: number): Promise<FullMovie | null> => {
  const [row] = await db
    .select({
      // summaries
      id: movieSummaries.id,
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      overview: movieSummaries.overview,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      popularity: movieSummaries.popularity,
      voteAverage: movieSummaries.voteAverage,
      voteCount: movieSummaries.voteCount,
      releaseDate: movieSummaries.releaseDate,
      posterBlurDataUrl: movieSummaries.posterBlurDataUrl,
      // details
      backdropBlurDataUrl: movieDetails.backdropBlurDataUrl,
      adult: movieDetails.adult,
      video: movieDetails.video,
      belongsToCollection: movieDetails.belongsToCollection,
      imdbId: movieDetails.imdbId,
      originalLanguage: movieDetails.originalLanguage,
      originalTitle: movieDetails.originalTitle,
      budget: movieDetails.budget,
      revenue: movieDetails.revenue,
      runtime: movieDetails.runtime,
      status: movieDetails.status,
      tagline: movieDetails.tagline,
      homepage: movieDetails.homepage,
      genres: movieDetails.genres,
      productionCompanies: movieDetails.productionCompanies,
      productionCountries: movieDetails.productionCountries,
      spokenLanguages: movieDetails.spokenLanguages,
      videos: movieDetails.videos,
      credits: movieDetails.credits,
      releases: movieDetails.releases,
      watchProviders: movieDetails.watchProviders,
      // if you need separate vote stats from details
      originCountry: movieDetails.originCountry,
      voteAverageDetail: movieDetails.voteAverage,
      voteCountDetail: movieDetails.voteCount,
    })
    .from(movieSummaries)
    .leftJoin(movieDetails, eq(movieDetails.summaryId, movieSummaries.id))
    .where(eq(movieSummaries.tmdbId, tmdbId))
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    releaseDate: row.releaseDate ? new Date(row.releaseDate) : null,
    adult: row.adult ?? true,
    video: row.video ?? false,
    releases: row.releases as {
      countries: Array<ReleaseDate>;
    },
    credits: row.credits as CreditsResponse,
    genres: row.genres as Genre[],
    spokenLanguages: row.spokenLanguages as Array<SpokenLanguage>,
    productionCompanies: row.productionCompanies as Array<ProductionCompany>,
    productionCountries: row.productionCountries as Array<ProductionCountry>,
    videos: row.videos as VideosResponse,
    status: row.status as
      | "Rumored"
      | "Planned"
      | "In Production"
      | "Post Production"
      | "Released"
      | "Canceled"
      | undefined,
    watchProviders: row.watchProviders as WatchProviderResponse,
    originCountry: row.originCountry as string[],
  }
}, [], {
  revalidate: 36000 // 10 hours
})

export const getFullTv = unstable_cache(async (tmdbId: number): Promise<FullTv | null> => {
  console.log("getFullTv called")
  const [row] = await db
    .select({
      // summary fields
      id: tvSummaries.id,
      tmdbId: tvSummaries.tmdbId,
      name: tvSummaries.name,
      overview: tvSummaries.overview,
      posterPath: tvSummaries.posterPath,
      backdropPath: tvSummaries.backdropPath,
      popularity: tvSummaries.popularity,
      voteAverage: tvSummaries.voteAverage,
      voteCount: tvSummaries.voteCount,
      firstAirDate: tvSummaries.firstAirDate,
      posterBlurDataUrl: tvSummaries.posterBlurDataUrl,

      // detail fields
      backdropBlurDataUrl: tvDetails.backdropBlurDataUrl,
      adult: tvDetails.adult,
      originalLanguage: tvDetails.originalLanguage,
      originalName: tvDetails.originalName,
      homepage: tvDetails.homepage,
      status: tvDetails.status,
      tagline: tvDetails.tagline,
      type: tvDetails.type,
      lastAirDate: tvDetails.lastAirDate,
      numberOfSeasons: tvDetails.numberOfSeasons,
      numberOfEpisodes: tvDetails.numberOfEpisodes,
      genres: tvDetails.genres,
      createdBy: tvDetails.createdBy,
      episodeRunTime: tvDetails.episodeRunTime,
      languages: tvDetails.languages,
      networks: tvDetails.networks,
      seasons: tvDetails.seasons,
      videos: tvDetails.videos,
      credits: tvDetails.credits,
      aggregateCredits: tvDetails.aggregateCredits,
      watchProviders: tvDetails.watchProviders,
      productionCompanies: tvDetails.productionCompanies,
      productionCountries: tvDetails.productionCountries,
      originCountry: tvDetails.originCountry,
      spokenLanguages: tvDetails.spokenLanguages,
      contentRatings: tvDetails.contentRatings,
      darkVibrantBackdropHex: tvDetails.darkVibrantBackdropHex
    })
    .from(tvSummaries)
    .leftJoin(tvDetails, eq(tvDetails.summaryId, tvSummaries.id))
    .where(eq(tvSummaries.tmdbId, tmdbId))
    .limit(1);

  if (!row) return null;

  return {
    // spread everything
    ...row,

    // convert the two date strings into real Dates
    firstAirDate: row.firstAirDate ? new Date(row.firstAirDate) : null,
    lastAirDate: row.lastAirDate ? new Date(row.lastAirDate) : null,

    // default booleans
    adult: row.adult ?? true,

    // coerce JSON blobs back to their types
    genres: row.genres as Genre[],
    createdBy: row.createdBy as SimplePerson[],
    episodeRunTime: row.episodeRunTime as number[],
    languages: row.languages as string[],
    networks: row.networks as Network[],
    seasons: row.seasons as SimpleSeason[],
    videos: row.videos as VideosResponse,
    credits: row.credits as CreditsResponse,
    aggregateCredits: row.aggregateCredits as AggregateCreditsResponse,
    watchProviders: row.watchProviders as WatchProviderResponse,
    productionCompanies: row.productionCompanies as ProductionCompany[],
    productionCountries: row.productionCountries as ProductionCountry[],
    originCountry: row.originCountry as string[],
    spokenLanguages: row.spokenLanguages as SpokenLanguage[],
    contentRatings: row.contentRatings as { results: RatingResponse[] },
  };
}, [], {
  revalidate: 36000 // 10 hours
})

export async function fetchDiscoverMovieIds() {
  const [
    { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies },
  ] = await Promise.all([
    fetchTmdbMovieLists(),
  ]);

  function getIds(discoverItemArrays: Array<MovieResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies]);
  ;
}

export async function fetchDiscoverTvIds() {
  const [
    { trendingTvDaily, trendingTvWeekly, popularTv },
  ] = await Promise.all([
    fetchTmdbTvLists(),
  ]);

  function getIds(discoverItemArrays: Array<TvResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingTvDaily, trendingTvWeekly, popularTv]);
  ;
}

export async function fetchDbDiscoverMovieIds() {
  const [
    trendingMovieItems,
    upcomingMovieItems,
    popularMovieItems,
  ] = await Promise.all([
    getTrendingMovies(DISCOVER_LIMIT),
    getUpcomingMovieSummaries(DISCOVER_LIMIT),
    getPopularMovies(DISCOVER_LIMIT),
  ]);

  function getIds(discoverItemArrays: Array<DiscoverItem[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.tmdbId) }));
  }

  return getIds([trendingMovieItems, upcomingMovieItems, popularMovieItems]);
  ;
}

export async function fetchDbDiscoverTvIds() {

  const [
    trendingTvItems,
    popularTvItems,
  ] = await Promise.all([
    getTrendingSeries(DISCOVER_LIMIT),
    getPopularSeries(DISCOVER_LIMIT),
  ]);

  function getIds(discoverItemArrays: Array<DiscoverItem[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.tmdbId) }));
  }

  return getIds([trendingTvItems, popularTvItems]);
}
