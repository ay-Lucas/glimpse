// TMDB offical genres and ids
export const TMDB_MOVIE_GENRES_MAP = new Map<number, string>([
  [28, "Action"],
  [12, "Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [14, "Fantasy"],
  [36, "History"],
  [27, "Horror"],
  [10402, "Music"],
  [9648, "Mystery"],
  [10749, "Romance"],
  [878, "Science Fiction"],
  [10770, "TV Movie"],
  [53, "Thriller"],
  [10752, "War"],
  [37, "Western"],
]);
export const TMDB_TV_GENRES_MAP = new Map<number, string>([
  [10759, "Action & Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [10762, "Kids"],
  [9648, "Mystery"],
  [10763, "News"],
  [10764, "Reality"],
  [10765, "Sci-Fi & Fantasy"],
  [10766, "Soap"],
  [10767, "Talk"],
  [10768, "War & Politics"],
  [37, "Western"],
]); // Combines TV and Movies TMDB genres
export const TMDB_TITLES_GENRES_MAP = new Map<number[], string>([
  // TV “Action & Adventure” (10759) → Movie 28 (“Action”) + 12 (“Adventure”)
  [[10759, 28, 12], "Action & Adventure"],

  // TV “Animation” (16) already exists as Movie 16
  [[16], "Animation"],

  // TV “Comedy” (35) → Movie 35
  [[35], "Comedy"],

  // TV “Crime” (80) → Movie 80
  [[80], "Crime"],

  // Documentary is the same ID 99 on both
  [[99], "Documentary"],

  [[37], "Western"],

  [[18], "Drama"], // TV 18 → Movie 18
  [[10751], "Family"], // TV 10751 → Movie 10751
  [[9648], "Mystery"],
  [[878, 14, 10765], "Sci-Fi & Fantasy"],
  // TV 10765 “Sci-Fi & Fantasy” → Movie 878 “Science Fiction” + 14 “Fantasy”
  // TV “War & Politics” 10768 → Movie 10752 “War”
  [[10768, 10752], "War & Politics"],
  // Movie-only Genres:
  // [[27], "Horror"],
  // [[10770], "TV Movie"], // Movie‐only tag
  // [[53], "Thriller"],
  // [[10749], "Romance"],
  // [[36], "History"],
  // [[10402], "Music"],
  // TV‐only genres:
  // [[10762], "Kids"],
  // [[10763], "News"],
  // [[10764], "Reality"],
  // [[10766], "Soap"],
  // [[10767], "Talk"],
]);
export interface GenreOption {
  /** This is what you’ll pass as the <option> value */
  value: string;
  /** What the user sees in the dropdown */
  label: string;
  /** All TMDB IDs to filter on (for movie/tv it’s just [id]) */
  ids: number[];
}

export const MOVIE_GENRES: GenreOption[] = [
  { value: "28", label: "Action", ids: [28] },
  { value: "12", label: "Adventure", ids: [12] },
  { value: "16", label: "Animation", ids: [16] },
  { value: "35", label: "Comedy", ids: [35] },
  { value: "80", label: "Crime", ids: [80] },
  { value: "99", label: "Documentary", ids: [99] },
  { value: "18", label: "Drama", ids: [18] },
  { value: "10751", label: "Family", ids: [10751] },
  { value: "14", label: "Fantasy", ids: [14] },
  { value: "36", label: "History", ids: [36] },
  { value: "27", label: "Horror", ids: [27] },
  { value: "10402", label: "Music", ids: [10402] },
  { value: "9648", label: "Mystery", ids: [9648] },
  { value: "10749", label: "Romance", ids: [10749] },
  { value: "878", label: "Science Fiction", ids: [878] },
  { value: "10770", label: "TV Movie", ids: [10770] },
  { value: "53", label: "Thriller", ids: [53] },
  { value: "10752", label: "War", ids: [10752] },
  { value: "37", label: "Western", ids: [37] },
];

export const TV_GENRES: GenreOption[] = [
  { value: "10759", label: "Action & Adventure", ids: [10759] },
  { value: "16", label: "Animation", ids: [16] },
  { value: "35", label: "Comedy", ids: [35] },
  { value: "80", label: "Crime", ids: [80] },
  { value: "99", label: "Documentary", ids: [99] },
  { value: "18", label: "Drama", ids: [18] },
  { value: "10751", label: "Family", ids: [10751] },
  { value: "10762", label: "Kids", ids: [10762] },
  { value: "9648", label: "Mystery", ids: [9648] },
  { value: "10763", label: "News", ids: [10763] },
  { value: "10764", label: "Reality", ids: [10764] },
  { value: "10765", label: "Sci-Fi & Fantasy", ids: [10765] },
  { value: "10766", label: "Soap", ids: [10766] },
  { value: "10767", label: "Talk", ids: [10767] },
  { value: "10768", label: "War & Politics", ids: [10768] },
  { value: "37", label: "Western", ids: [37] },
];

export const TITLES_GENRES: GenreOption[] = [
  { value: "10759", label: "Action & Adventure", ids: [10759, 28, 12] },
  { value: "16", label: "Animation", ids: [16] },
  { value: "35", label: "Comedy", ids: [35] },
  { value: "80", label: "Crime", ids: [80] },
  { value: "99", label: "Documentary", ids: [99] },
  { value: "37", label: "Western", ids: [37] },
  { value: "18", label: "Drama", ids: [18] },
  { value: "10751", label: "Family", ids: [10751] },
  { value: "9648", label: "Mystery", ids: [9648] },
  { value: "10765", label: "Sci-Fi & Fantasy", ids: [10765, 878, 14] },
  { value: "10768", label: "War & Politics", ids: [10768, 10752] },
];

export const NSFW_GENRE_ID = 69;

export const CUSTOM_GENRES: GenreOption[] = [
  { value: "", label: "All Genres", ids: [] },
  { value: NSFW_GENRE_ID.toString(), label: "NSFW", ids: [NSFW_GENRE_ID] },
];

export function getMovieGenres(): GenreOption[] {
  const combined = [...CUSTOM_GENRES.slice(1), ...MOVIE_GENRES].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  combined.unshift(CUSTOM_GENRES[0]!);
  return combined;
}

export function getTvGenres(): GenreOption[] {
  const combined = [...CUSTOM_GENRES.slice(1), ...TV_GENRES].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  combined.unshift(CUSTOM_GENRES[0]!);
  return combined;
}

export function getTitlesGenres(): GenreOption[] {
  const combined = [...CUSTOM_GENRES.slice(1), ...TITLES_GENRES].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  combined.unshift(CUSTOM_GENRES[0]!);
  return combined;
}

export const GENRES = {
  movie: {
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIENCE_FICTION: 878,
    TV_MOVIE: 10770,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37,
  },
  tv: {
    ACTION_ADVENTURE: 10759,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    KIDS: 10762,
    MYSTERY: 9648,
    NEWS: 10763,
    REALITY: 10764,
    SCI_FI_FANTASY: 10765,
    SOAP: 10766,
    TALK: 10767,
    WAR_POLITICS: 10768,
    WESTERN: 37,
  },
  custom: {
    NSFW: 69,
  },
} as const;

// ------------------------------------------------------------
// 2) Labels (shared keys for both movie/tv enums above)
// ------------------------------------------------------------
export const GENRE_LABELS = {
  // Movie
  ACTION: "Action",
  ADVENTURE: "Adventure",
  ANIMATION: "Animation",
  COMEDY: "Comedy",
  CRIME: "Crime",
  DOCUMENTARY: "Documentary",
  DRAMA: "Drama",
  FAMILY: "Family",
  FANTASY: "Fantasy",
  HISTORY: "History",
  HORROR: "Horror",
  MUSIC: "Music",
  MYSTERY: "Mystery",
  ROMANCE: "Romance",
  SCIENCE_FICTION: "Science Fiction",
  TV_MOVIE: "TV Movie",
  THRILLER: "Thriller",
  WAR: "War",
  WESTERN: "Western",

  // TV
  ACTION_ADVENTURE: "Action & Adventure",
  KIDS: "Kids",
  NEWS: "News",
  REALITY: "Reality",
  SCI_FI_FANTASY: "Sci-Fi & Fantasy",
  SOAP: "Soap",
  TALK: "Talk",
  WAR_POLITICS: "War & Politics",

  // Custom
  NSFW: "NSFW",
} as const;
