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
  unique,
  numeric,
  doublePrecision,
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
