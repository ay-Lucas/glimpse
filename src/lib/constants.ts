export const backgroundImages = [
  "oppenheimer.jpg",
  "psych.jpg",
  "shogun.jpg",
  "interstellar.jpg",
];

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const BASE_API_URL = "https://api.themoviedb.org/3";

export const BASE_ORIGINAL_IMAGE_URL = "https://image.tmdb.org/t/p/original";
export const BASE_SMALL_BACKDROP_URL = "https://image.tmdb.org/t/p/w300";
export const BASE_POSTER_IMAGE_URL = "https://image.tmdb.org/t/p/w342"; // 342w x 513h
export const BASE_PROFILE_IMAGE_URL = "https://image.tmdb.org/t/p/h632";
export const BASE_BLUR_IMAGE_URL = "https://image.tmdb.org/t/p/w92";
export const BASE_SMALL_LOGO_URL = "https://image.tmdb.org/t/p/w92";
export const BASE_MEDIUM_LOGO_URL = "https://image.tmdb.org/t/p/w154";
export const BASE_CAST_IMAGE_URL = "https://image.tmdb.org/t/p/w185";

export enum BaseImageUrl {
  ORIGINAL = BASE_ORIGINAL_IMAGE_URL,
  BLUR = BASE_BLUR_IMAGE_URL,
  CAST = BASE_CAST_IMAGE_URL,
  POSTER = BASE_POSTER_IMAGE_URL,
}

export const DEFAULT_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const options: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
  // cache: "force-cache",
  // next: { revalidate: 43200 },
};

export const DISCOVER_LIMIT = 20 as const;
// export const genres = new Map([
//   [28, "Action"],
//   [12, "Adventure"],
//   [16, "Animation"],
//   [35, "Comedy"],
//   [80, "Crime"],
//   [99, "Documentary"],
//   [18, "Drama"],
//   [10751, "Family"],
//   [14, "Fantasy"],
//   [36, "History"],
//   [27, "Horror"],
//   [10402, "Music"],
//   [9648, "Mystery"],
//   [10749, "Romance"],
//   [878, "Science Fiction"],
//   [10770, "TV Movie"],
//   [53, "Thriller"],
//   [10752, "War"],
//   [37, "Western"],
// ]);
//
// TMDB offical genres and ids
export const genres = new Map([
  ["Action", 28],
  ["Adventure", 12],
  ["Animation", 16],
  ["Comedy", 35],
  ["Crime", 80],
  ["Documentary", 99],
  ["Drama", 18],
  ["Family", 1075],
  ["Fantasy", 14],
  ["History", 36],
  ["Horror", 27],
  ["Music", 1040],
  ["Mystery", 9648],
  ["Romance", 1074],
  ["Science Fiction", 878],
  ["TV Movie", 1077],
  ["Thriller", 53],
  ["War", 1075],
  ["Western", 37],
]);

export const TMDB_GENDERS = new Map([
  [0, "Not Specified"],
  [1, "Female"],
  [2, "Male"],
  [3, "Non-binary"],
]);

export const NUM_OF_POPULAR_PEOPLE_PAGES = 1000;
export const NUM_TMDB_PAGES = 2;

export const MAX_RES_BY_PROVIDER: Record<string, "_4K" | "HD" | "SD"> = {
  // exact match on the JustWatch `Provider` field:
  "Netflix Standard with Ads": "HD",
  "Netflix Basic with Ads": "HD",
  // add more overrides here...
};

// Mostly AI Bots
export const BLOCKED_BOT_UA = new RegExp(
  [
    "AI2Bot",
    "Ai2Bot\\-Dolma",
    "Amazonbot",
    "anthropic\\-ai",
    "Applebot",
    "Applebot\\-Extended",
    "Brightbot 1\\.0",
    "Bytespider",
    "CCBot",
    "Claude\\-Web",
    "ClaudeBot",
    "cohere\\-ai",
    "cohere\\-training\\-data\\-crawler",
    "Crawlspace",
    "Diffbot",
    "DuckAssistBot",
    "FacebookBot",
    "FriendlyCrawler",
    "GPTBot",
    "iaskspider\\/2\\.0",
    "ICC\\-Crawler",
    "ImagesiftBot",
    "img2dataset",
    "ISSCyberRiskCrawler",
    "Kangaroo Bot",
    "Meta\\-ExternalAgent",
    "Meta\\-ExternalFetcher",
    "OAI\\-SearchBot",
    "omgili",
    "omgilibot",
    "PanguBot",
    "PerplexityBot",
    "PetalBot",
    "Scrapy",
    "SemrushBot\\-OCOB",
    "SemrushBot\\-SWA",
    "Sidetrade indexer bot",
    "Timpibot",
    "VelenPublicWebCrawler",
    "Webzio\\-Extended",
    "YouBot",
    "DigitalOceanGenAICrawler\\/1\\.0",
  ].join("|"),
  "i"
);

export const ALLOWED_BOT_UA = new RegExp(
  [
    "ChatGPT\\-User",
    "Google\\-Extended",
    "GoogleOther",
    "GoogleOther\\-Image",
    "GoogleOther\\-Video",
    "Googlebot\\-Image",
  ].join("|"),
  "i"
);
