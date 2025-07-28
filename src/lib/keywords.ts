export const ACTION_ADVENTURE_KEYWORD_IDS = [
  9073, // martial arts
  9715, // sword fight
  9713, // superhero
  470, // spy
  803, // treasure hunt
  9716, // post-apocalyptic
  9712, // rescue
  5565, // heist
  4950, // pirate
  9882, // space adventure
  4379, // time travel
  4152, // kingdom
] as const;

/** hand-curated map: tag → array of TMDB keyword IDs */
export const TAG2ID: Record<string, number[]> = {
  // — vibes —
  "slow-burn": [233062], // “slow burn”
  "high-octane": [280648], // “high octane”
  "dark comedy": [9663], // “dark comedy”

  // — aesthetics —
  "film-noir": [26184, 26121], // “film noir”, “neo-noir”
  "retro-80s": [12394, 224397], // “1980s”, “retro”
  neon: [248396], // “neon”
  cyberpunk: [4502], // “cyberpunk”
  cottagecore: [338155], // “cottagecore”
  "rainy-day": [1652], // “rain”
  "space-opera": [4652], // “space opera”

  // — moods that TMDB keywords cover poorly —
  cozy: [172525], // “feel good”
  uplifting: [158371], // “uplifting”
  "mind-bending": [152658], // “mind-bending”
};
