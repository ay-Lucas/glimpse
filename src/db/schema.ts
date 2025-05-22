import { sql } from "drizzle-orm";
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
  numeric,
  date,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const watchlistItems = pgTable("watchlistItems", {
  id: serial("id").primaryKey(),
  watchlistId: uuid("watchlistId").references(() => watchlist.id),
  itemId: uuid("itemId").default(sql`gen_random_uuid()`), // ID of the item being watched
  tmdbId: integer("tmdbId").notNull(),
  title: text("title").notNull(),
  itemType: text({ enum: ["tv", "movie"] }).notNull(),
  genres: text("genres").array().notNull(),
  tmdbVoteAverage: doublePrecision(),
  rating: text("rating"),
  popularity: integer("popularity"),
  language: text("language"),
  numberOfSeasons: integer("numberOfSeasons"),
  numberOfEpisodes: integer("numberOfEpisodes"),
  summary: text("summary"),
  posterPath: text("posterPath"),
  backdropPath: text("backdropPath"),
});

export const watchlist = pgTable("watchlist", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(), // Auto-generate UUID
  userId: text("userId").references(() => users.id),
  watchlistName: text("watchlistName").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  default: boolean("default").notNull().default(false), // Indicates if this is the default watchlist
});

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
  budget: integer("budget"),
  revenue: integer("revenue"),
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
});

export const tvDetails = pgTable(
  "tv_details",
  {
    summaryId: integer("summary_id")
      .primaryKey()
      .unique()
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
  },
  (t) => ({
    // unique constraint to ensure one details row per summary
    summaryUk: unique("tv_details_summary_uk").on(t.summaryId),
  }),
);

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
  }),
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
      t.position,
    ),
  }),
);
// Causes Drizzle to crash when pushing with `npx drizzle-kit push` (Known Issue)

//
// export const authenticators = pgTable(
//   "authenticator",
//   {
//     credentialID: text("credentialID").notNull().unique(),
//     userId: text("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     providerAccountId: text("providerAccountId").notNull(),
//     credentialPublicKey: text("credentialPublicKey").notNull(),
//     counter: integer("counter").notNull(),
//     credentialDeviceType: text("credentialDeviceType").notNull(),
//     credentialBackedUp: boolean("credentialBackedUp").notNull(),
//     transports: text("transports"),
//   },
//   (authenticator) => ({
//     compositePK: primaryKey({
//       columns: [authenticator.userId, authenticator.credentialID],
//     }),
//   }),
// );
