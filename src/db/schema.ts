import { sql } from "drizzle-orm";
import { double } from "drizzle-orm/mysql-core";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  uuid,
  doublePrecision,
  date,
  jsonb,
  unique,
  bigint,
  check,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  email: text("email").notNull().unique(),
  emailVerificationToken: text("email_verification_token"),
  email_confirmation_sent_at: timestamp("email_confirmation_sent_at", {
    mode: "string",
    withTimezone: true,
  }),
});

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: serial("id").primaryKey(),
    watchlistId: uuid("watchlist_id")
      .notNull()
      .references(() => watchlist.id, { onDelete: "cascade" }),
    movieId: integer("movie_id").references(() => movies.id),
    tvId: integer("tv_id").references(() => tvShows.id),
    addedAt: timestamp("added_at", { mode: "string" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // ensure exactly one of movieId / tvId is non-null
    oneOrTheOther: check(
      "watchlist_items_one_media_xor", // ← You choose a unique name
      sql`(
        (movie_id IS NOT NULL AND tv_id IS NULL)
        OR
        (movie_id IS NULL     AND tv_id IS NOT NULL)
      )`
    ),
  })
);

// export const watchlistItems = pgTable("watchlist_items", {
//   id: serial("id").primaryKey(),
//   watchlistId: uuid("watchlist_id").references(() => watchlist.id, {
//     onDelete: "cascade",
//   }),
//   mediaId: integer("media_id")
//     .notNull()
//     .references(() => tv.id || movie.id),
//   tmdbId: integer("tmdb_id").notNull(),
//   title: text("title").notNull(),
//   itemType: text({ enum: ["tv", "movie"] }).notNull(),
//   genres: text("genres").array().notNull(),
//   tmdbVoteAverage: doublePrecision(),
//   rating: text("rating"),
//   popularity: integer("popularity"),
//   language: text("language"),
//   numberOfSeasons: integer("number_of_seasons"),
//   numberOfEpisodes: integer("number_of_episodes"),
//   imdbScore: doublePrecision("imdb_score"),
//   imdbCount: doublePrecision("imdb_count"),
//   rottenTomatoesScore: doublePrecision("rotten_tomatoes_score"),
//   justWatchInfo: jsonb("justwatch_info"),
//   summary: text("summary"),
//   posterPath: text("poster_path"),
//   backdropPath: text("backdrop_path"),
// });

export const movies = pgTable("movies", {
  // TMDb’s own id
  id: integer("id").primaryKey(),

  // from MovieResult
  adult: boolean("adult").notNull(),
  backdropPath: text("backdrop_path").notNull(),
  genreIds: jsonb("genre_ids").notNull(), // number[]
  originCountry: text("origin_country").array(),
  originalLanguage: text("original_language").notNull(),
  originalTitle: text("original_title").notNull(),
  overview: text("overview").notNull(),
  popularity: doublePrecision("popularity").notNull(),
  posterPath: text("poster_path").notNull(),
  releaseDate: timestamp("release_date", { mode: "string" }),
  title: text("title").notNull(),
  video: boolean("video").notNull(),
  voteAverage: doublePrecision("vote_average").notNull(),
  voteCount: integer("vote_count").notNull(),

  // from TmdbMovieDetailsResponse
  belongsToCollection: boolean("belongs_to_collection"),
  budget: integer("budget").notNull(),
  genres: jsonb("genres").notNull(), // Genre[]
  homepage: text("homepage"),
  revenue: integer("revenue").notNull(),
  runtime: integer("runtime"),
  spokenLanguages: jsonb("spoken_languages").notNull(), // SpokenLanguage[]
  status: text("status"),
  tagline: text("tagline"),
  productionCompanies: jsonb("production_companies").notNull(), // ProductionCompany[]
  productionCountries: jsonb("production_countries").notNull(), // ProductionCountry[]

  // from TmdbMovieDetailsResponseAppended
  videos: jsonb("videos"), // VideosResponse
  credits: jsonb("credits"), // CreditsResponse
  aggregateCredits: jsonb("aggregate_credits"), // AggregateCreditsResponse
  watchProviders: jsonb("watch_providers"), // WatchProviderResponse
  releaseDates: jsonb("release_dates"), // MovieReleaseDatesResponse
  externalIds: jsonb("external_ids"), // MovieExternalIdsResponse
  images: jsonb("images"), // MovieImagesResponse
  similar: jsonb("similar"), // SimilarShowsResponse
  justWatchInfo: jsonb("justwatch_info"),
});

export const tvShows = pgTable("tv_shows", {
  // TMDb’s own id
  id: integer("id").primaryKey(),

  // from TvResult
  adult: boolean("adult").notNull(),
  backdropPath: text("backdrop_path").notNull(),
  genreIds: jsonb("genre_ids").notNull(), // number[]
  originCountry: text("origin_country").array(),
  originalLanguage: text("original_language").notNull(),
  originalName: text("original_name").notNull(),
  overview: text("overview").notNull(),
  popularity: doublePrecision("popularity").notNull(),
  posterPath: text("poster_path").notNull(),
  firstAirDate: timestamp("first_air_date", { mode: "string" }),
  name: text("name").notNull(),
  voteAverage: doublePrecision("vote_average").notNull(),
  voteCount: integer("vote_count").notNull(),

  // from TmdbTvDetailsResponse
  createdBy: jsonb("created_by").notNull(), // CreatedBy[]
  episodeRunTime: jsonb("episode_run_time").notNull(), // number[]
  genres: jsonb("genres").notNull(), // Genre[]
  homepage: text("homepage"),
  inProduction: boolean("in_production").notNull(),
  languages: jsonb("languages").notNull(), // string[]
  lastAirDate: timestamp("last_air_date", { mode: "string" }),
  lastEpisodeToAir: jsonb("last_episode_to_air"), // EpisodeToAir
  nextEpisodeToAir: jsonb("next_episode_to_air"),
  networks: jsonb("networks").notNull(), // Network[]
  numberOfEpisodes: integer("number_of_episodes").notNull(),
  numberOfSeasons: integer("number_of_seasons").notNull(),
  productionCompanies: jsonb("production_companies").notNull(), // ProductionCompany[]
  productionCountries: jsonb("production_countries").notNull(), // ProductionCountry[]
  seasons: jsonb("seasons").notNull(), // Season[]
  spokenLanguages: jsonb("spoken_languages").notNull(), // SpokenLanguage[]
  status: text("status"),
  tagline: text("tagline"),
  type: text("type"),

  // from TmdbTvDetailsResponseAppended
  videos: jsonb("videos"), // VideosResponse
  credits: jsonb("credits"), // CreditsResponse
  aggregateCredits: jsonb("aggregate_credits"), // AggregateCreditsResponse
  watchProviders: jsonb("watch_providers"), // WatchProviderResponse
  contentRatings: jsonb("content_ratings"), // ShowContentRatingResponse
  externalIds: jsonb("external_ids"), // TvExternalIdsResponse
  images: jsonb("images"), // TvImagesResponse
  similar: jsonb("similar"), // SimilarShowsResponse
  justWatchInfo: jsonb("justwatch_info"),
});

export const watchlist = pgTable(
  "watchlist",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .default(sql`now()`),
    isDefault: boolean("is_default").notNull().default(false),
    description: text("description"), // optional longer blurb
    isPublic: boolean("is_public") // can share/follow
      .notNull()
      .default(false),
    slug: varchar("slug", { length: 100 }).unique(), // shareable URL
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => sql`now()`),
    itemCount: integer("item_count") // denormalized count
      .notNull()
      .default(0),
    coverImage: text("cover_image"), // optional thumbnail URL
    sortOrder: jsonb("sort_order") // e.g. [ { id: 123, pos: 0 }, … ]
      .notNull()
      .default(sql`'[]'::jsonb`),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'`),
  },
  (table) => {
    // Partial unique index so only one isDefault=true per user
    return {
      oneDefaultPerUser: uniqueIndex("one_default_per_user")
        .on(table.userId)
        .where(sql`${table.isDefault} = true`),
      userNameUnique: uniqueIndex("watchlist_user_name_unique").on(
        table.userId,
        table.name
      ),
    };
  }
);

export const rateLimitLog = pgTable("rate_limit_log", {
  id: text("id").primaryKey(), // use nanoid or similar
  ip: text("ip").notNull(),
  route: text("route").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rateLimitViolation = pgTable("rate_limit_violation", {
  ip: text("ip").primaryKey().notNull(),
  count: integer("count").default(1).notNull(),
  lastViolation: timestamp("last_violation").defaultNow().notNull(),
});

export const movieSummaries = pgTable("movie_summaries", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  popularity: doublePrecision("popularity"),
  voteAverage: doublePrecision("vote_average"),
  voteCount: integer("vote_count"),
  releaseDate: date("release_date"),
  posterBlurDataUrl: text("poster_blur_data_url"),
  justWatchInfo: jsonb("justwatch_info"),
});

export const movieDetails = pgTable("movie_details", {
  summaryId: integer("summary_id")
    .primaryKey()
    .references(() => movieSummaries.id, { onDelete: "cascade" }),

  // Basic flags & paths
  adult: boolean("adult").notNull().default(true),
  video: boolean("video").notNull().default(true),
  backdropBlurDataUrl: text("backdrop_blur_data_url"),

  // Collection info
  belongsToCollection: text("belongs_to_collection"),
  // Identifiers & titles
  imdbId: text("imdb_id"),
  originalLanguage: text("original_language"),
  originalTitle: text("original_title"),
  originCountry: text("origin_country").array(),
  // Dates & stats
  budget: bigint("budget", { mode: "number" }),
  revenue: bigint("revenue", { mode: "number" }),
  runtime: integer("runtime"),
  popularity: doublePrecision("popularity"),
  voteAverage: doublePrecision("vote_average"),
  voteCount: integer("vote_count"),

  // Text content
  status: text("status"),
  tagline: text("tagline"),
  homepage: text("homepage"),

  // JSON payloads
  genres: jsonb("genres").notNull(),
  productionCompanies: jsonb("production_companies"),
  productionCountries: jsonb("production_countries"),
  spokenLanguages: jsonb("spoken_languages"),
  watchProviders: jsonb("watch_providers"),

  videos: jsonb("videos"),
  credits: jsonb("credits"),
  releases: jsonb("releases"),
});

export const tvSummaries = pgTable("tv_summaries", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  name: text("name").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  popularity: doublePrecision("popularity"),
  voteAverage: doublePrecision("vote_average"),
  voteCount: integer("vote_count"),
  firstAirDate: date("first_air_date"),
  posterBlurDataUrl: text("poster_blur_data_url"),
  justWatchInfo: jsonb("justwatch_info"),
});

export const tvDetails = pgTable("tv_details", {
  summaryId: integer("summary_id")
    .primaryKey()
    .references(() => tvSummaries.id, { onDelete: "cascade" }),
  // basic flags & identifiers
  adult: boolean("adult").notNull().default(true),
  originalLanguage: text("original_language"),
  originalName: text("original_name"),
  originCountry: text("origin_country").array(),
  homepage: text("homepage"),
  status: text("status"),
  tagline: text("tagline"),
  type: text("type"),
  backdropBlurDataUrl: text("backdrop_blur_data_url"),
  darkVibrantBackdropHex: text("dark_vibrant_backdrop_hex"),

  // dates & counts
  lastAirDate: date("last_air_date"),
  numberOfSeasons: integer("number_of_seasons"),
  numberOfEpisodes: integer("number_of_episodes"),

  // nested blobs
  genres: jsonb("genres").notNull(),
  createdBy: jsonb("created_by"), // array of creators
  episodeRunTime: jsonb("episode_run_time"), // array of ints
  languages: jsonb("languages"), // array of iso_ codes
  networks: jsonb("networks"),
  seasons: jsonb("seasons"),
  videos: jsonb("videos"),
  credits: jsonb("credits"),
  aggregateCredits: jsonb("aggregate_credits"),
  watchProviders: jsonb("watch_providers"),
  contentRatings: jsonb("content_ratings"),
  productionCompanies: jsonb("production_companies"),
  productionCountries: jsonb("production_countries"),
  spokenLanguages: jsonb("spoken_languages"),
});

export const episodeDetails = pgTable(
  "episode_details",
  {
    summaryId: integer("summary_id")
      .notNull()
      .references(() => tvSummaries.id, { onDelete: "cascade" }),
    seasonNumber: integer("season_number").notNull(),
    episodeNumber: integer("episode_number").notNull(),

    airDate: date("air_date"),
    name: text("name"),
    overview: text("overview"),
    productionCode: text("production_code"),
    runtime: integer("runtime"),
    stillPath: text("still_path"),

    voteAverage: doublePrecision("vote_average"),
    voteCount: integer("vote_count"),

    // arrays of objects
    crew: jsonb("crew"), // array of { department, job, credit_id, crew_member… }
    guestStars: jsonb("guest_stars"), // array of { character, credit_id, order, person… }
  },
  (t) => ({
    // composite PK: one row per show/season/episode
    pk: primaryKey({
      columns: [t.summaryId, t.seasonNumber, t.episodeNumber],
    }),
  })
);

export const personSummaries = pgTable("person_summaries", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  name: text("name").notNull(),
  profilePath: text("profile_path"),
  blurDataUrl: text("blur_data_url"),
});

export const personDetails = pgTable("person_details", {
  summaryId: integer("summary_id")
    .primaryKey()
    .references(() => personSummaries.id, { onDelete: "cascade" }),
  biography: text("biography"),
  birthday: date("birthday"),
  placeOfBirth: text("place_of_birth"),
  combinedCredits: jsonb("combined_credits"),
});

export const listEntries = pgTable(
  "list_entries",
  {
    listName: text("list_name").notNull(), // e.g. "trending_series"
    tmdbId: integer("tmdb_id").notNull(),
    mediaType: text("media_type").notNull(), // "tv" or "movie"
    position: integer("position").notNull(),
    fetchedAt: timestamp("fetched_at", { mode: "string" })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.listName, t.tmdbId] }),
    // and if you still want to unique‐enforce (list_name, position):
    listPositionUnique: unique("list_entries_position_unique").on(
      t.listName,
      t.position
    ),
  })
);
