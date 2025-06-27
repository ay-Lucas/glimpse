import CreditsPage from "@/app/(media)/_components/credits-page"
import { fetchDiscoverMovieIds } from "@/app/(media)/actions";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverMovieIds = await fetchDiscoverMovieIds();
  return discoverMovieIds;
}

export default function MovieCreditsRoute({
  params: { id },
}: {
  params: { id: string };
}) {
  return <CreditsPage mediaType="movie" id={id} />;
}
