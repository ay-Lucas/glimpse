import { pgTable, text, timestamp, integer, foreignKey, uuid, boolean, unique, serial, doublePrecision, date, jsonb, bigint, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const rateLimitLog = pgTable("rate_limit_log", {
	id: text().primaryKey().notNull(),
	ip: text().notNull(),
	route: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const rateLimitViolation = pgTable("rate_limit_violation", {
	ip: text().primaryKey().notNull(),
	count: integer().default(1).notNull(),
	lastViolation: timestamp("last_violation", { mode: 'string' }).defaultNow().notNull(),
});

export const watchlist = pgTable("watchlist", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text(),
	watchlistName: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	default: boolean().default(false).notNull(),
},
(table) => {
	return {
		watchlistUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "watchlist_userId_user_id_fk"
		}),
	}
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
},
(table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const watchlistItems = pgTable("watchlistItems", {
	id: serial().primaryKey().notNull(),
	watchlistId: uuid(),
	itemId: uuid().defaultRandom(),
	tmdbId: integer().notNull(),
	title: text().notNull(),
	itemType: text().notNull(),
	genres: text().array().notNull(),
	tmdbVoteAverage: doublePrecision(),
	rating: text(),
	popularity: integer(),
	language: text(),
	numberOfSeasons: integer(),
	numberOfEpisodes: integer(),
	summary: text(),
	posterPath: text(),
	backdropPath: text(),
},
(table) => {
	return {
		watchlistItemsWatchlistIdWatchlistIdFk: foreignKey({
			columns: [table.watchlistId],
			foreignColumns: [watchlist.id],
			name: "watchlistItems_watchlistId_watchlist_id_fk"
		}),
	}
});

export const tvDetails = pgTable("tv_details", {
	summaryId: integer("summary_id").primaryKey().notNull(),
	adult: boolean().default(true).notNull(),
	originalLanguage: text("original_language"),
	originalName: text("original_name"),
	originCountry: text("origin_country").array(),
	homepage: text(),
	status: text(),
	tagline: text(),
	type: text(),
	backdropBlurDataUrl: text("backdrop_blur_data_url"),
	darkVibrantBackdropHex: text("dark_vibrant_backdrop_hex"),
	lastAirDate: date("last_air_date"),
	numberOfSeasons: integer("number_of_seasons"),
	numberOfEpisodes: integer("number_of_episodes"),
	genres: jsonb().notNull(),
	createdBy: jsonb("created_by"),
	episodeRunTime: jsonb("episode_run_time"),
	languages: jsonb(),
	networks: jsonb(),
	seasons: jsonb(),
	videos: jsonb(),
	credits: jsonb(),
	aggregateCredits: jsonb("aggregate_credits"),
	watchProviders: jsonb("watch_providers"),
	contentRatings: jsonb("content_ratings"),
	productionCompanies: jsonb("production_companies"),
	productionCountries: jsonb("production_countries"),
	spokenLanguages: jsonb("spoken_languages"),
},
(table) => {
	return {
		tvDetailsSummaryIdTvSummariesIdFk: foreignKey({
			columns: [table.summaryId],
			foreignColumns: [tvSummaries.id],
			name: "tv_details_summary_id_tv_summaries_id_fk"
		}).onDelete("cascade"),
	}
});

export const tvSummaries = pgTable("tv_summaries", {
	id: serial().primaryKey().notNull(),
	tmdbId: integer("tmdb_id").notNull(),
	name: text().notNull(),
	overview: text().notNull(),
	posterPath: text("poster_path"),
	backdropPath: text("backdrop_path"),
	popularity: doublePrecision(),
	voteAverage: doublePrecision("vote_average"),
	voteCount: integer("vote_count"),
	firstAirDate: date("first_air_date"),
	posterBlurDataUrl: text("poster_blur_data_url"),
},
(table) => {
	return {
		tvSummariesTmdbIdUnique: unique("tv_summaries_tmdb_id_unique").on(table.tmdbId),
	}
});

export const movieSummaries = pgTable("movie_summaries", {
	id: serial().primaryKey().notNull(),
	tmdbId: integer("tmdb_id").notNull(),
	title: text().notNull(),
	overview: text().notNull(),
	posterPath: text("poster_path"),
	backdropPath: text("backdrop_path"),
	popularity: doublePrecision(),
	voteAverage: doublePrecision("vote_average"),
	voteCount: integer("vote_count"),
	releaseDate: date("release_date"),
	posterBlurDataUrl: text("poster_blur_data_url"),
},
(table) => {
	return {
		movieSummariesTmdbIdUnique: unique("movie_summaries_tmdb_id_unique").on(table.tmdbId),
	}
});

export const movieDetails = pgTable("movie_details", {
	summaryId: integer("summary_id").primaryKey().notNull(),
	adult: boolean().default(true).notNull(),
	video: boolean().default(true).notNull(),
	backdropBlurDataUrl: text("backdrop_blur_data_url"),
	belongsToCollection: text("belongs_to_collection"),
	imdbId: text("imdb_id"),
	originalLanguage: text("original_language"),
	originalTitle: text("original_title"),
	originCountry: text("origin_country").array(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	budget: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	revenue: bigint({ mode: "number" }),
	runtime: integer(),
	popularity: doublePrecision(),
	voteAverage: doublePrecision("vote_average"),
	voteCount: integer("vote_count"),
	status: text(),
	tagline: text(),
	homepage: text(),
	genres: jsonb().notNull(),
	productionCompanies: jsonb("production_companies"),
	productionCountries: jsonb("production_countries"),
	spokenLanguages: jsonb("spoken_languages"),
	watchProviders: jsonb("watch_providers"),
	videos: jsonb(),
	credits: jsonb(),
	releases: jsonb(),
},
(table) => {
	return {
		movieDetailsSummaryIdMovieSummariesIdFk: foreignKey({
			columns: [table.summaryId],
			foreignColumns: [movieSummaries.id],
			name: "movie_details_summary_id_movie_summaries_id_fk"
		}).onDelete("cascade"),
	}
});

export const personSummaries = pgTable("person_summaries", {
	id: serial().primaryKey().notNull(),
	tmdbId: integer("tmdb_id").notNull(),
	name: text().notNull(),
	profilePath: text("profile_path"),
	blurDataUrl: text("blur_data_url"),
},
(table) => {
	return {
		personSummariesTmdbIdUnique: unique("person_summaries_tmdb_id_unique").on(table.tmdbId),
	}
});

export const personDetails = pgTable("person_details", {
	summaryId: integer("summary_id").primaryKey().notNull(),
	biography: text(),
	birthday: date(),
	placeOfBirth: text("place_of_birth"),
	combinedCredits: jsonb("combined_credits"),
},
(table) => {
	return {
		personDetailsSummaryIdPersonSummariesIdFk: foreignKey({
			columns: [table.summaryId],
			foreignColumns: [personSummaries.id],
			name: "person_details_summary_id_person_summaries_id_fk"
		}).onDelete("cascade"),
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
	}
});

export const listEntries = pgTable("list_entries", {
	listName: text("list_name").notNull(),
	tmdbId: integer("tmdb_id").notNull(),
	mediaType: text("media_type").notNull(),
	position: integer().notNull(),
	fetchedAt: timestamp("fetched_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		listEntriesListNameTmdbIdPk: primaryKey({ columns: [table.listName, table.tmdbId], name: "list_entries_list_name_tmdb_id_pk"}),
		listEntriesPositionUnique: unique("list_entries_position_unique").on(table.listName, table.position),
	}
});

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});

export const episodeDetails = pgTable("episode_details", {
	summaryId: integer("summary_id").notNull(),
	seasonNumber: integer("season_number").notNull(),
	episodeNumber: integer("episode_number").notNull(),
	airDate: date("air_date"),
	name: text(),
	overview: text(),
	productionCode: text("production_code"),
	runtime: integer(),
	stillPath: text("still_path"),
	voteAverage: doublePrecision("vote_average"),
	voteCount: integer("vote_count"),
	crew: jsonb(),
	guestStars: jsonb("guest_stars"),
},
(table) => {
	return {
		episodeDetailsSummaryIdTvSummariesIdFk: foreignKey({
			columns: [table.summaryId],
			foreignColumns: [tvSummaries.id],
			name: "episode_details_summary_id_tv_summaries_id_fk"
		}).onDelete("cascade"),
		episodeDetailsSummaryIdSeasonNumberEpisodeNumberPk: primaryKey({ columns: [table.summaryId, table.seasonNumber, table.episodeNumber], name: "episode_details_summary_id_season_number_episode_number_pk"}),
	}
});
