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

export const baseApiUrl = "https://api.themoviedb.org/3";

export const baseImageUrl = "https://image.tmdb.org/t/p/original";

export const options: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
  cache: "force-cache",
};

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
