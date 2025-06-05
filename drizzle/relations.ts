import { relations } from "drizzle-orm/relations";
import { user, watchlist, session, watchlistItems, tvSummaries, tvDetails, movieSummaries, movieDetails, personSummaries, personDetails, account, episodeDetails } from "./schema";

export const watchlistRelations = relations(watchlist, ({one, many}) => ({
	user: one(user, {
		fields: [watchlist.userId],
		references: [user.id]
	}),
	watchlistItems: many(watchlistItems),
}));

export const userRelations = relations(user, ({many}) => ({
	watchlists: many(watchlist),
	sessions: many(session),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const watchlistItemsRelations = relations(watchlistItems, ({one}) => ({
	watchlist: one(watchlist, {
		fields: [watchlistItems.watchlistId],
		references: [watchlist.id]
	}),
}));

export const tvDetailsRelations = relations(tvDetails, ({one}) => ({
	tvSummary: one(tvSummaries, {
		fields: [tvDetails.summaryId],
		references: [tvSummaries.id]
	}),
}));

export const tvSummariesRelations = relations(tvSummaries, ({many}) => ({
	tvDetails: many(tvDetails),
	episodeDetails: many(episodeDetails),
}));

export const movieDetailsRelations = relations(movieDetails, ({one}) => ({
	movieSummary: one(movieSummaries, {
		fields: [movieDetails.summaryId],
		references: [movieSummaries.id]
	}),
}));

export const movieSummariesRelations = relations(movieSummaries, ({many}) => ({
	movieDetails: many(movieDetails),
}));

export const personDetailsRelations = relations(personDetails, ({one}) => ({
	personSummary: one(personSummaries, {
		fields: [personDetails.summaryId],
		references: [personSummaries.id]
	}),
}));

export const personSummariesRelations = relations(personSummaries, ({many}) => ({
	personDetails: many(personDetails),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const episodeDetailsRelations = relations(episodeDetails, ({one}) => ({
	tvSummary: one(tvSummaries, {
		fields: [episodeDetails.summaryId],
		references: [tvSummaries.id]
	}),
}));