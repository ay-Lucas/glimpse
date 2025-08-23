import { SearchMediaType } from "./utils";
import { NSFW_GENRE_ID } from "@/lib/title-genres";
import { InfiniteSearchList } from "../(media)/_components/infinite-search-list";
import { DiscoverSearch } from "../(browse)/discover/_components/discover-search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query: string;
    page?: string;
    genreIds?: string;
    includeAdult?: boolean;
    mediaType?: SearchMediaType;
  };
}) {
  if (searchParams === undefined || searchParams.query === "") throw Error;

  const params = {
    query: searchParams.query,
    region: "en-US",
    genreIds: searchParams ? searchParams.genreIds?.split(",") : null,
    includeAdult: searchParams.includeAdult ?? false,
    mediaType: searchParams.mediaType ?? "titles",
    page: 1,
    language: "en-US",
    id: "",
  };

  // Process custom genres
  const rawGenreIds = params.genreIds?.map(Number) ?? null;

  if (rawGenreIds && rawGenreIds.find((id) => id === NSFW_GENRE_ID)) {
    params.includeAdult = true;
    params.genreIds = null; // reset genreIds, treat as if none
  }

  const genreIds = params.genreIds?.map(Number) ?? null;

  return (
    <main className="relative min-h-[75vh] md:min-h-[85vh]">
      <div className="px-2 pt-10 md:container">
        <div className="pb-5">
          <DiscoverSearch />
        </div>

        {/* <div className="flex flex-shrink flex-wrap justify-start gap-4 md:gap-8"> */}
        <InfiniteSearchList
          mediaType={params.mediaType}
          query={params.query}
          includeAdult={params.includeAdult}
          genreIds={genreIds}
        />
      </div>
    </main>
  );
}
