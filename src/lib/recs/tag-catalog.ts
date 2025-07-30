export type TagCategory = "vibe" | "aesthetic";

export interface TagSpec {
  tag: string; // label shown in the UI chip
  ids?: number[]; // TMDB keyword IDs (omit if none yet)
}

// ─── Core chips that appear by default ──────────────────────────────────────
const CORE_VIBES: TagSpec[] = [
  { tag: "slow-burn", ids: [233062] },
  { tag: "high-octane", ids: [280648] },
  { tag: "dark comedy", ids: [9663] },
  { tag: "heist", ids: [1612] },
  { tag: "revenge", ids: [9748] },
  { tag: "buddy-cop", ids: [11863] },
  { tag: "coming-of-age", ids: [11444] },
];

const CORE_AESTHETICS: TagSpec[] = [
  { tag: "film-noir", ids: [26184, 26121] },
  { tag: "retro-80s", ids: [12394, 224397] },
  { tag: "cyberpunk", ids: [4502] },
  { tag: "neon", ids: [248396] },
  { tag: "space-opera", ids: [4652] },
  { tag: "gothic", ids: [695] },
  { tag: "steampunk", ids: [226406] },
];

// ─── Additional chips shown in a “More …” drawer ────────────────────────────
const EXTRA_VIBES: TagSpec[] = [
  { tag: "slice-of-life", ids: [210024] },
  { tag: "bittersweet", ids: [195315] },
  { tag: "surreal", ids: [167918] },
  { tag: "campy", ids: [225268] },
  { tag: "gritty", ids: [180547] },
  { tag: "heart-warming", ids: [172525] }, // alias of “feel good”
  { tag: "whodunit", ids: [189987] },
  { tag: "time-travel", ids: [4379] },
  { tag: "found-footage", ids: [945] },
  { tag: "anti-hero", ids: [187972] },
];

const EXTRA_AESTHETICS: TagSpec[] = [
  { tag: "rainy-day", ids: [1652] },
  { tag: "cottagecore", ids: [338155] },
  { tag: "art-deco", ids: [220558] },
  { tag: "neon-noir", ids: [26121] },
  { tag: "retro-future", ids: [224397] },
  { tag: "desert-wasteland", ids: [180737] },
  { tag: "snowy-setting", ids: [158718] },
  { tag: "underwater", ids: [181256] },
  { tag: "dystopian", ids: [34117] },
  { tag: "road-trip", ids: [10566] },
  { tag: "holiday", ids: [207317] },
  { tag: "coastal", ids: [18094] },
];

// ─── Export unified catalog ─────────────────────────────────────────────────

const CATALOG = {
  vibe: [...CORE_VIBES, ...EXTRA_VIBES],
  aesthetic: [...CORE_AESTHETICS, ...EXTRA_AESTHETICS],
} as const satisfies Record<TagCategory, TagSpec[]>;
export default CATALOG;

// chips for default UI panels
export const VIBES = CORE_VIBES.map((o) => o.tag) as readonly string[];
export const AESTHETICS = CORE_AESTHETICS.map(
  (o) => o.tag
) as readonly string[];

// chips for optional drawers (if implemented)
export const EXTRA_VIBES_LIST = EXTRA_VIBES.map(
  (o) => o.tag
) as readonly string[];
export const EXTRA_AESTHETICS_LIST = EXTRA_AESTHETICS.map(
  (o) => o.tag
) as readonly string[];

// mapping for buildSmartPool()
export const TAG2ID: Record<string, number[]> = Object.fromEntries(
  Object.values(CATALOG).flatMap((group) =>
    group.filter((o) => o.ids?.length).map((o) => [o.tag, o.ids!])
  )
);

// helper to warn about tags missing keyword IDs (dev only)
export function missingIds(): string[] {
  return Object.values(CATALOG)
    .flat()
    .filter((o) => !o.ids?.length)
    .map((o) => o.tag);
}
