"use client";
import { SetStateAction, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "./ui/command";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { DialogTitle } from "./ui/dialog";
import { SearchMediaType } from "@/app/search/utils";
import {
  getMediaTypeToggleLabel,
  MediaTypeToggle,
  GenreDropdown,
  MediaType,
} from "@/app/(browse)/discover/_components/discover-search";
import {
  PersonResult,
  MovieResult,
  TvResult,
} from "@/types/request-types-camelcase";
import { CommandItem } from "cmdk";
import { BASE_SMALL_POSTER_IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
//TODO: add auto complete
type SearchResult = MovieResult | TvResult | PersonResult;
export function SearchCommandDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      const params = new URLSearchParams({ query: query.trim() });
      params.set("mediaType", filter.mediaType);
      if (filter.genreId?.length)
        params.set("genreIds", filter.genreId.join(","));
      router.push(`/search?${params.toString()}`);
      setOpen(false);
    }
  };

  const [filter, setFilter] = useState<{
    mediaType: SearchMediaType;
    genreId?: number[];
  }>({ mediaType: "titles" });

  const onSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams({ query: query.trim() });
    params.set("mediaType", filter.mediaType);
    if (filter.genreId?.length)
      params.set("genreIds", filter.genreId.join(","));
    router.push(`/search?${params.toString()}`);
  };

  const placeholderText =
    filter.mediaType === "titles"
      ? "TV Shows and Movies"
      : getMediaTypeToggleLabel(filter.mediaType);

  useEffect(() => {
    if (!open) return;

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          query: q,
          mediaType: filter.mediaType,
          includeAdult: "false",
          page: "1",
        });
        if (filter.genreId?.length)
          params.set("genreIds", filter.genreId.join(","));

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data: { results: SearchResult[] } = await res.json();
        setResults(data.results);
      } catch (e: any) {
        if (e?.name !== "AbortError")
          setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      ac.abort();
      clearTimeout(timeoutId);
    };
  }, [open, query, filter.mediaType, (filter.genreId || []).join(",")]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={query}
        placeholder={`Search for ${placeholderText}`}
        onValueChange={setQuery}
        onKeyDown={handleEnter}
      />
      <div className="flex w-fit space-x-2 p-2">
        <MediaTypeToggle
          mediaType={filter.mediaType}
          onChange={(mt) => setFilter({ mediaType: mt, genreId: undefined })}
        />
        {filter.mediaType !== "person" && (
          <GenreDropdown
            mediaType={filter.mediaType as Exclude<MediaType, "person">}
            value={filter.genreId}
            onChange={(g) => setFilter((f) => ({ ...f, genreId: g }))}
          />
        )}
      </div>
      <CommandList>
        <DialogTitle hidden>Search</DialogTitle>
        <CommandGroup>
          {results.map((item) => {
            const view = normalizeSearchResult(item);
            const href = resultToHref(item, query);
            return (
              <Link href={href} key={`${item.mediaType}-${item.id}`}>
                <CommandItem
                  value={view.title || ""}
                  aria-label={view.title || "Result"}
                  // onMouseEnter={() => router.prefetch(href)}
                  onSelect={() => {
                    // router.push(href);
                    setOpen(false);
                  }}
                  className="rounded-md hover:bg-muted"
                >
                  <SearchResult item={item} view={view} />
                </CommandItem>
              </Link>
            );
          })}
        </CommandGroup>
        <CommandEmpty>
          {loading
            ? "Searching..."
            : error
              ? "Couldn’t fetch results."
              : "No results found."}
        </CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}

function SearchResult({
  item,
  view,
}: {
  item: SearchResult;
  view: SearchView;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="shrink-0">
        {view.poster ? (
          <Image
            src={`${BASE_SMALL_POSTER_IMAGE_URL}${view.poster}`}
            alt={`${view.title} poster`}
            width={60}
            height={90}
            className="rounded"
            loading="lazy"
          />
        ) : (
          <div className="h-[90px] w-[60px] rounded bg-muted" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate">{view.title}</div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="uppercase">{item.mediaType}</span>
          {view.year && <span>{view.year}</span>}
        </div>
      </div>
    </div>
  );
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle with <C-K> or <M-K>
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // Close using <C-[> escape vim keybinding
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="w-full md:max-w-md">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center space-x-2 rounded-md bg-secondary px-2"
        aria-label="Open search"
      >
        <IoSearchOutline size={22} />
        <Input
          readOnly
          className={`h-8 border-none bg-transparent px-0`}
          placeholder="Search for a series or movie"
        />
        <p className="text-center text-muted-foreground">
          <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100">
            <span className="text-lg">⌘</span>K
          </kbd>
        </p>
      </button>
      <SearchCommandDialog open={open} setOpen={setOpen} />
    </div>
  );
}

interface SearchView {
  title: string;
  poster: string | null;
  year?: number;
}
function normalizeSearchResult(result: SearchResult): SearchView {
  if (result.mediaType === "movie") {
    const movie = result as MovieResult;
    return {
      title: movie.title,
      poster: movie.posterPath || null,
      year: movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : undefined,
    };
  }
  if (result.mediaType === "tv") {
    const tv = result as TvResult;
    return {
      title: (tv as any).name,
      poster: tv.posterPath || null,
      year: (tv as any).firstAirDate
        ? new Date((tv as any).firstAirDate).getFullYear()
        : undefined,
    };
  }
  const person = result as PersonResult;
  return {
    title: (person as any).name,
    poster: (person as any).profilePath || null,
    year: undefined,
  };
}

function resultToHref(r: SearchResult, currentQuery: string) {
  switch (r.mediaType) {
    case "movie":
      return `/movie/${r.id}`;
    case "tv":
      return `/tv/${r.id}`;
    case "person":
      return `/person/${r.id}`;
    default:
      return `/search?query=${encodeURIComponent(currentQuery)}`;
  }
}
