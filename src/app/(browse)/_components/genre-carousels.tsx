import TitleCarousel from "@/components/title-carousel";
import type { GenreOption } from "@/lib/title-genres";
import type { MovieResult, TvResult } from "@/types/request-types-camelcase";
import pLimit from "p-limit";

type FetchByGenre = (genreId: number) => Promise<(MovieResult | TvResult)[]>;

interface GenreCarouselsProps {
  heading: string;
  genres: GenreOption[];
  fetchByGenre: FetchByGenre;
  mediaType?: "tv" | "movie";
  concurrency?: number;
  pickGenreId?: (genre: GenreOption) => number | undefined;
}

export default async function GenreCarousels({
  heading,
  genres,
  fetchByGenre,
  mediaType = "tv",
  concurrency = 5,
  pickGenreId = (g) => g.ids[0],
}: GenreCarouselsProps) {
  const limit = pLimit(concurrency);

  const promises = genres.map((g) =>
    limit(async () => {
      const id = pickGenreId(g);
      if (!id) return undefined;
      try {
        const titles = await fetchByGenre(id);
        return { genre: g.label, titles };
      } catch (err) {
        console.error(`Error fetching genre ${g.label}:`, err);
        return undefined;
      }
    })
  );

  const genreLists = (await Promise.all(promises)).filter(
    (g): g is { genre: string; titles: (MovieResult | TvResult)[] } =>
      g !== undefined
  );

  return (
    <>
      <h1 className="pb-4 text-start text-3xl font-bold">{heading}</h1>
      {genreLists.map((l) => (
        <TitleCarousel
          key={l.genre}
          title={l.genre}
          titles={l.titles}
          mediaType={mediaType}
          breakpointType="title"
        />
      ))}
    </>
  );
}

