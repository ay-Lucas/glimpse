import { fetchDiscoverTvIds } from "@/app/(media)/actions";
import CreditsPage from "@/app/(media)/_components/credits-page";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverTvIds = await fetchDiscoverTvIds();
  return discoverTvIds;
}

export default function TvCreditsRoute({
  params: { id },
}: {
  params: { id: string };
}) {
  return <CreditsPage mediaType="tv" id={id} />;
}
