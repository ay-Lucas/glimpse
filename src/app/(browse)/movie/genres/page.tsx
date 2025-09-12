import GenreCarousels from "@/app/(browse)/_components/genre-carousels";
import { MOVIE_GENRES } from "@/lib/title-genres";
import { trendingMoviesByGenreSmart } from "../actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "Movie Genres",
};

export default async function MovieGenrePage() {
  return (
    <GenreCarousels
      heading="Movie Genres"
      genres={MOVIE_GENRES}
      mediaType="movie"
      fetchByGenre={(id) => trendingMoviesByGenreSmart(id, 1, 6, [], 50, [])}
    />
  );
}
