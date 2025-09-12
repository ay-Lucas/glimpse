import GenreCarousels from "@/app/(browse)/_components/genre-carousels";
import { TV_GENRES } from "@/lib/title-genres";
import { trendingTvByGenreSmart } from "../actions";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "TV Show Genres",
};

export default async function TvGenrePage() {
  return (
    <GenreCarousels
      heading="TV Genres"
      genres={TV_GENRES}
      mediaType="tv"
      fetchByGenre={(id) => trendingTvByGenreSmart(id, 1, 6, [], 50, [])}
    />
  );
}
