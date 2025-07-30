// ─── outbound contract ────────────────────────────────────────────────
export interface MatchPayload {
  /** 1-D array passed to the LLM (lower-cased, de-duped).  
      Convention: tags[0] === mood, order after that doesn’t matter. */
  tags: string[];

  /** Structured filters the server can enforce before the LLM step. */
  filters: {
    /** “movie” → films only, “series” → TV only, “either” → both */
    media: "movie" | "series" | "either";

    /** Inclusive year range slider */
    years: [number, number];

    /** Max runtime in minutes (movies only) */
    runtime_max: number;

    /** Language codes the user is OK watching */
    language: string[];

    /** ------- UI buckets so we can rebuild the page from a URL ------- */
    vibe?: string[]; // ≤ 3
    aesthetic?: string[]; // ≤ 2
    interests?: string[]; // free-text, ≤ 12

    /** Trigger warnings to down-rank or exclude */
    avoid?: string[];
  };
}

// ─── UI state coming from your page ────────────────────────────────────
export interface MoodState {
  mood: string | null; // single selection
  vibe: string[]; // ≤ 3
  aesthetic: string[]; // ≤ 2
  interests: string[]; // free-text tags
  includeSeries: boolean; // toggle
  yearRange: [number, number]; // slider
  runtime: number; // max minutes
  language?: string[]; // optional locale array
  avoid?: string[]; // optional triggers
}

// ─── helper ────────────────────────────────────────────────────────────
export function buildPayload(state: MoodState): MatchPayload {
  // 1) concatenate & normalise tags
  const tags = [
    state.mood,
    ...state.vibe,
    ...state.aesthetic,
    ...state.interests,
  ]
    .filter(Boolean)
    .map((t) => t!.trim().toLowerCase());

  // de-duplicate while preserving order
  const deduped = Array.from(new Set(tags));

  // 2) derive filters
  const filters: MatchPayload["filters"] = {
    media: state.includeSeries ? "either" : "movie",
    years: state.yearRange,
    runtime_max: state.runtime,
    language: state.language?.length ? state.language : ["en"],
    ...(state.avoid?.length && { avoid: state.avoid }),
    interests: state.interests,
  };

  return { tags: deduped, filters };
}
