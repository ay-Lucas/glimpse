"use server";

const baseImageUrl = "https://image.tmdb.org/t/p/original";
const url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
  cache: "force-cache",
};

export async function getBackgrounds() {
  const backgrounds = await fetch(url, options);
  const res = await backgrounds.json();
  const items = res.results;
  const backdropUrls = [20];
  items.map(
    (item, i) =>
      (backdropUrls[i] =
        `https://image.tmdb.org/t/p/original${item.backdrop_path}`),
  );
  // console.log(backdropUrls);
  return backdropUrls;
}
