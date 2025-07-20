import CreditsSection from "@/app/(media)/_components/credits-page";
import MediaBanner from "@/app/(media)/_components/media-banner";
import {
  fetchDiscoverMovieIds,
  fetchMovieDetails,
} from "@/app/(media)/actions";
import { toDateString } from "@/lib/dates";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverMovieIds = await fetchDiscoverMovieIds();
  return discoverMovieIds;
}

export default async function MovieCreditsRoute({
  params: { id },
}: {
  params: { id: number };
}) {
  const movie = await fetchMovieDetails(Number(id));
  const releaseDate = toDateString(movie.releaseDate);
  return (
    <main className="pt-3">
      <MediaBanner
        name={movie.title}
        firstAirDate={releaseDate}
        id={Number(id)}
        backdropPath={movie.backdropPath}
        mediaType={"movie"}
      />
      <CreditsSection
        mediaType="movie"
        showId={id}
        cast={movie.credits?.cast ?? []}
        crew={movie.credits?.crew ?? []}
        releaseDate={releaseDate}
        title={movie.title}
      />
    </main>
  );
}
