"use client";
import { SetStateAction, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandList,
} from "./ui/command";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { DialogTitle } from "./ui/dialog";
import {
  GenreDropdown,
  getMediaTypeToggleLabel,
  MediaType,
  MediaTypeToggle,
} from "@/app/discover/_components/discover-search";
import { SearchMediaType } from "@/app/search/utils";
//TODO: add auto complete

export function SearchCommandDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && query !== "") {
      router.push(`/search?query=${query}`);
      setOpen(false);
    }
  };

  const [filter, setFilter] = useState<{
    mediaType: SearchMediaType;
    genreId?: number[];
  }>({ mediaType: "titles" });

  const onSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams({ query });
    params.set("mediaType", filter.mediaType);
    if (filter.genreId?.length) {
      params.set("genreIds", filter.genreId.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  const placeholderText =
    filter.mediaType === "titles"
      ? "TV Shows and Movies"
      : getMediaTypeToggleLabel(filter.mediaType);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
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
        {/* <CommandEmpty>No results found.</CommandEmpty> */}
        {/* <CommandGroup heading="Results"> */}
        {/*   <CommandItem>Calendar</CommandItem> */}
        {/*   <CommandItem>Search Emoji</CommandItem> */}
        {/*   <CommandItem>Calculator</CommandItem> */}
        {/* </CommandGroup> */}
      </CommandList>
    </CommandDialog>
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
      <a
        onClick={() => setOpen(true)}
        className="flex w-full items-center space-x-2 rounded-md bg-secondary px-2"
      >
        <IoSearchOutline size={22} />
        <Input
          className={`h-8 border-none bg-transparent px-0`}
          placeholder="Search for a series or movie"
        />
        <p className="text-center text-muted-foreground">
          <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100 slide-out-to-bottom-36">
            <span className="text-lg">⌘</span>K
          </kbd>
        </p>
      </a>
      <SearchCommandDialog open={open} setOpen={setOpen} />
    </div>
  );
}
