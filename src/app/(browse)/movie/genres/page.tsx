import TitleCarousel from "@/components/title-carousel";
import { MOVIE_GENRES } from "@/lib/title-genres";
import pLimit from "p-limit";
import { trendingMoviesByGenreSmart } from "../actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Movie Genres",
};

export default async function MovieGenrePage() {
  const limit = pLimit(5);
  const genrePromises = MOVIE_GENRES.map((g) =>
    limit(async () => {
      try {
        return {
          titles: await trendingMoviesByGenreSmart(g.ids[0]!, 1, 6, [], 50, []),
          genre: g.label,
        };
      } catch (err) {
        console.error(`Error fetching genre ${g.label}:`, err);
      }
    })
  );
  const genreLists = (await Promise.all(genrePromises)).filter(
    (g) => g !== undefined
  );
  return (
    <>
      <h1 className="pb-4 text-start text-3xl font-bold">Movie Genres</h1>
      {genreLists.map((l, index) => (
        <TitleCarousel
          title={l.genre}
          titles={l.titles}
          mediaType="movie"
          breakpointType="title"
          englishOnly={false}
          key={index}
        />
      ))}
    </>
  );
}

