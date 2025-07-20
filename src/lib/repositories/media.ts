import { db } from "@/db/index";
import { movies, tvShows } from "@/db/schema";
import {
  TmdbMovieDetailsResponseAppended,
  TmdbTvDetailsResponseAppended,
} from "@/types/tmdb-camel";
import { InferInsertModel } from "drizzle-orm";
import { WatchlistWithItems, MovieModel, TvShowModel } from "./watchlist";
import { toDateString } from "../dates";

/**
 * Returns true if a movie with the given TMDb ID already exists in your `movies` table.
 */
export async function movieExists(tmdbId: number): Promise<boolean> {
  const row = await db.query.movies.findFirst({
    where: (m, { eq }) => eq(m.id, tmdbId),
  });
  return row !== undefined;
}

/**
 * Returns true if a TV show with the given TMDb ID already exists in your `tv_shows` table.
 */
export async function tvShowExists(tmdbId: number): Promise<boolean> {
  const row = await db.query.tvShows.findFirst({
    where: (t, { eq }) => eq(t.id, tmdbId),
  });
  return row !== undefined;
}

export function normalizeTvDetails(
  d: TmdbTvDetailsResponseAppended
): InferInsertModel<typeof tvShows> {
  return {
    id: d.id,
    adult: d.adult,
    backdropPath: d.backdropPath,
    genreIds: d.genreIds ?? [],
    originCountry: d.originCountry ?? [],
    originalLanguage: d.originalLanguage,
    originalName: d.originalName,
    overview: d.overview,
    popularity: d.popularity,
    posterPath: d.posterPath,
    firstAirDate: toDateString(d.firstAirDate),
    name: d.name,
    voteAverage: d.voteAverage,
    voteCount: d.voteCount,

    // detail fields
    createdBy: d.createdBy ?? [],
    episodeRunTime: d.episodeRunTime ?? [],
    genres: d.genres ?? [],
    homepage: d.homepage ?? null,
    inProduction: d.inProduction,
    languages: d.languages ?? [],
    lastAirDate: d.lastAirDate?.trim() ? d.lastAirDate : null,
    lastEpisodeToAir: d.lastEpisodeToAir ?? null,
    nextEpisodeToAir: d.nextEpisodeToAir ?? null,
    networks: d.networks ?? [],
    numberOfEpisodes: d.numberOfEpisodes,
    numberOfSeasons: d.numberOfSeasons,
    productionCompanies: d.productionCompanies ?? [],
    productionCountries: d.productionCountries ?? [],
    seasons: d.seasons ?? [],
    spokenLanguages: d.spokenLanguages ?? [],
    status: d.status ?? null,
    tagline: d.tagline ?? null,
    type: d.type ?? null,

    // appended
    videos: d.videos ?? null,
    credits: d.credits ?? null,
    aggregateCredits: d.aggregateCredits ?? null,
    watchProviders: d.watchProviders ?? null,
    contentRatings: d.contentRatings ?? null,
    externalIds: d.externalIds ?? null,
    images: d.images ?? null,
    similar: d.similar ?? null,
  };
}

export function normalizeMovieDetails(
  d: TmdbMovieDetailsResponseAppended
): InferInsertModel<typeof movies> {
  return {
    // MovieResult fields
    id: d.id,
    adult: d.adult,
    backdropPath: d.backdropPath,
    genreIds: d.genreIds ?? [],
    originalLanguage: d.originalLanguage,
    originalTitle: d.originalTitle,
    overview: d.overview,
    popularity: d.popularity,
    posterPath: d.posterPath,
    releaseDate: toDateString(d.releaseDate),
    title: d.title,
    video: d.video,
    voteAverage: d.voteAverage,
    voteCount: d.voteCount,

    // TmdbMovieDetailsResponse fields
    belongsToCollection: d.belongsToCollection,
    budget: d.budget,
    genres: d.genres ?? [],
    homepage: d.homepage ?? null,
    revenue: d.revenue,
    runtime: d.runtime ?? null,
    spokenLanguages: d.spokenLanguages ?? [],
    status: d.status ?? null,
    tagline: d.tagline ?? null,
    productionCompanies: d.productionCompanies ?? [],
    productionCountries: d.productionCountries ?? [],

    // TmdbMovieDetailsResponseAppended fields
    videos: d.videos ?? null,
    credits: d.credits ?? null,
    aggregateCredits: d.aggregateCredits ?? null,
    watchProviders: d.watchProviders ?? null,
    releaseDates: d.releaseDates ?? null,
    externalIds: d.externalIds ?? null,
    images: d.images ?? null,
    similar: d.similar ?? null,
  };
}

export async function getMediaForWatchlists(
  watchlists: WatchlistWithItems[]
): Promise<{
  movies: MovieModel[];
  tvShows: TvShowModel[];
}> {
  const movieIdSet = new Set<number>();
  const tvIdSet = new Set<number>();

  for (const wl of watchlists) {
    // items may be undefined if you used ? on WatchlistWithItems
    for (const item of wl.items ?? []) {
      if (item.movieId != null) movieIdSet.add(item.movieId);
      if (item.tvId != null) tvIdSet.add(item.tvId);
    }
  }

  const movieIds = Array.from(movieIdSet);
  const tvIds = Array.from(tvIdSet);

  // if you have no IDs, skip the query early
  const [moviesList, tvList] = await Promise.all([
    movieIds.length
      ? db.query.movies.findMany({
          where: (m, { inArray }) => inArray(m.id, movieIds),
        })
      : Promise.resolve<MovieModel[]>([]),

    tvIds.length
      ? db.query.tvShows.findMany({
          where: (t, { inArray }) => inArray(t.id, tvIds),
        })
      : Promise.resolve<TvShowModel[]>([]),
  ]);

  return {
    movies: moviesList,
    tvShows: tvList,
  };
}
