"use server";
import { db } from "@/db/index";
import {
  TmdbMovieDetailsResponseAppended,
  TmdbTvDetailsResponseAppended,
} from "@/types/tmdb-camel";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { normalizeMovieDetails, normalizeTvDetails } from "./media";
import { movies, tvShows } from "@/db/schema";

export async function upsertRecord<
  T extends AnyPgTable,
  K extends keyof T["$inferInsert"] & string,
>(
  table: T,
  data: T["$inferInsert"],
  conflictKey: K // e.g. "id"
): Promise<T["$inferSelect"]> {
  // pull the column off the table by name:
  const conflictColumn = (table as any)[conflictKey];

  const [row] = await db
    .insert(table)
    .values(data)
    .onConflictDoUpdate({
      target: conflictColumn, // this is now a real Column
      set: data,
    })
    .returning();

  return row!;
}

export async function upsertMovieDetails(
  details: TmdbMovieDetailsResponseAppended
) {
  const insertable = normalizeMovieDetails(details);
  return upsertRecord(movies, insertable, "id");
}

export async function upsertTvDetails(details: TmdbTvDetailsResponseAppended) {
  const insertable = normalizeTvDetails(details);
  return upsertRecord(tvShows, insertable, "id");
}
