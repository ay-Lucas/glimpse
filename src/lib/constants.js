export const backgroundImages = [
  "oppenheimer.jpg",
  "psych.jpg",
  "shogun.jpg",
  "interstellar.jpg",
];

export const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const baseApiUrl = "https://api.themoviedb.org/3";

export const baseImageUrl = "https://image.tmdb.org/t/p/original";

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
  cache: "force-cache",
};
