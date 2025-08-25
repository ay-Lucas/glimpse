import TitleCarousel from "@/components/title-carousel";
import { TV_GENRES } from "@/lib/title-genres";
import { trendingTvByGenreSmart } from "../actions";
import pLimit from "p-limit";

export const revalidate = 43200; // 12 hours

export const metadata = {
  title: "Glimpse",
  description: "TV Show Genres",
};

export default async function TvGenrePage() {
  const limit = pLimit(5);
  const genrePromises = TV_GENRES.map((g) =>
    limit(async () => {
      try {
        return {
          titles: await trendingTvByGenreSmart(g.ids[0]!, 1, 6, [], 50, []),
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
      <h1 className="pb-4 text-start text-3xl font-bold">TV Genres</h1>
      {genreLists.map((l, index) => (
        <TitleCarousel
          title={l.genre}
          titles={l.titles}
          breakpointType="title"
          englishOnly={false}
          key={index}
        />
      ))}
    </>
  );
}
