"use client";

import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMovieGenres,
  getTitlesGenres,
  getTvGenres,
} from "@/lib/title-genres";
import { SearchMediaType } from "@/app/search/utils";

type MediaType = "titles" | "movie" | "tv" | "person";

// 1) MediaType toggle
interface MediaTypeToggleProps {
  mediaType: SearchMediaType;
  onChange: (m: MediaType) => void;
}
function MediaTypeToggle({ mediaType, onChange }: MediaTypeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={mediaType}
      onValueChange={(v) => onChange(v as MediaType)}
      className="inline-flex rounded-md bg-muted p-1"
    >
      <ToggleGroupItem
        value="titles"
        className="rounded-md px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        Titles
      </ToggleGroupItem>
      <ToggleGroupItem
        value="tv"
        className="rounded-md px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        TV Shows
      </ToggleGroupItem>
      <ToggleGroupItem
        value="movie"
        className="rounded-md px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        Movies
      </ToggleGroupItem>
      <ToggleGroupItem
        value="person"
        className="rounded-md px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        People
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

interface GenreDropdownProps {
  mediaType: Exclude<MediaType, "person">; // only titles/movie/tv
  value?: number[];
  onChange: (ids?: number[]) => void;
}

function GenreDropdown({ mediaType, value, onChange }: GenreDropdownProps) {
  const [open, setOpen] = useState(false);

  // pick which to show
  const options = useMemo(() => {
    switch (mediaType) {
      case "movie":
        return getMovieGenres();
      case "tv":
        return getTvGenres();
      default:
        return getTitlesGenres();
    }
  }, [mediaType]);

  // label for the button
  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.ids === value);
    return found ? found.label : "All Genres";
  }, [options, value]);

  const inputRef = useRef<HTMLInputElement>(null);

  // whenever the menu opens, focus the CommandInput
  useEffect(() => {
    if (open) {
      // give Radix a tick to fully render the dropdown
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <span className="max-w-[100px] truncate">{selectedLabel}</span>
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search genres…" ref={inputRef} />
          <CommandList>
            <CommandEmpty>No genres found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label} // enable searching with strings
                  onSelect={(val) => {
                    onChange(val === "" ? undefined : opt.ids);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      opt.ids === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DiscoverSearch() {
  const [filter, setFilter] = useState<{
    mediaType: SearchMediaType;
    genreId?: number[];
  }>({ mediaType: "titles" });

  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams({ query });
    params.set("mediaType", filter.mediaType);
    if (filter.genreId?.length) {
      params.set("genreIds", filter.genreId.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
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

      <input
        type="search"
        className="flex-1 rounded-md border px-3 py-2 text-sm"
        placeholder="Search for titles or people…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      <Button onClick={onSearch} size="sm">
        <IoSearchOutline size={18} />
      </Button>
    </div>
  );
}
