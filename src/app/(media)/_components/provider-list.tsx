"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { languageCodeToEnglishName } from "@/lib/utils";
import { StreamingInfo, StreamProvider } from "justwatch-api-client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed
import Image from "next/image";
import { BsBadge4K, BsBadgeHd, BsBadgeSd } from "react-icons/bs";

export default function JustWatchProviderList({ info }: { info: StreamingInfo }) {
  const MAX_INLINE = 4;
  const [open, setOpen] = useState(false);
  const resolutions = new Map<string, string[]>();
  const providerMap = info.Streams.reduce<Record<string, typeof info.Streams[0]>>((map, s) => {
    if (s.Provider.toLowerCase().includes("channel"))
      return map
    if (!map[s.Provider]) map[s.Provider] = s;

    const resArray = resolutions.get(s.Provider) ?? [];
    resArray.push(s.Resolution)
    resolutions.set(s.Provider, resArray)
    return map;
  }, {});
  const providers = Object.values(providerMap);
  const inlineProviders = providers.slice(0, MAX_INLINE);
  console.log()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ul className="space-y-1 w-full">
        {inlineProviders.map((p) => (
          <ProviderCard provider={p} resolutions={resolutions.get(p.Provider) ?? []} key={p.Provider} />
        ))}
      </ul>
      {providers.length > MAX_INLINE && (
        <DialogTrigger asChild>
          <Button variant="link" size="sm" className="text-md">
            +{providers.length - MAX_INLINE} more
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>All Providers</DialogTitle>
        <ul className="space-y-0">
          {providers.map((p) => (
            <ModalProviderCard provider={p} resolutions={resolutions.get(p.Provider) ?? []} key={p.Provider} />
          ))}
        </ul>
        <div className="mt-4 text-right">
          <DialogClose asChild>
            <Button size="sm">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalProviderCard({ provider, resolutions }: { provider: StreamProvider, resolutions: string[] }) {
  const {
    Provider: providerName,
    Icon: iconUrl,
    Name,
    Link: url,
    Type,
    Audio = [],
    Price,
  } = provider;

  const highestRes = useMemo(
    () => getHighestProviderResolution(resolutions),
    [resolutions]
  );

  const typeLabel = capitalizeFirst(
    Type === "FLATRATE" ? "subscription" : Type.toLowerCase()
  );

  const audioList = Audio.length
    ? Audio.map(languageCodeToEnglishName).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";
  const ctaLabel = isCinemaType ? "Buy Tickets" : "Watch Now";

  return (
    <li key={providerName} className="hover:bg-muted/70 duration-200 bg-transparent border-b" >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="grid grid-cols-2 sm:grid-cols-[1fr_125px]
                   items-center gap-4 p-2"
      >
        <div className={`grid ${isCinemaType ? "grid-cols-2" : "grid-cols-3"} gap-5 items-center`}>
          <Image
            src={iconUrl}
            alt={`${Name} logo`}
            width={140}
            height={48}
            className="rounded object-cover"
          />

          {(highestRes || audioList) && (
            <div className="flex flex-col text-sm">
              {highestRes && <span>{getResolutionIcon(highestRes, 25)}</span>}
              {audioList && (
                <span className="text-xs text-gray-400">{audioList}</span>
              )}
            </div>
          )}

          <div className="flex flex-col text-sm">
            <span className="font-medium">{typeLabel}</span>
            {Price && <span className="text-xs text-muted-foreground">{Price}</span>}
          </div>
        </div>
        <div className="text-left">
          <Button size="sm" variant="outline">
            {ctaLabel}
          </Button>
        </div>
      </a>
    </li>
  );
}



function ProviderCard({ provider, resolutions, }: { provider: StreamProvider, resolutions: string[] }) {
  const {
    Provider: providerName,
    Icon: iconUrl,
    Name,
    Link: url,
    Type,
    Audio = [],
    Price,
  } = provider;

  const highestRes = useMemo(
    () => getHighestProviderResolution(resolutions),
    [resolutions]
  );

  const typeLabel =
    capitalizeFirst(Type === "FLATRATE" ? "subscription" : Type);

  const audioList = Audio.length
    ? Audio.map(languageCodeToEnglishName).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";

  return (
    <li className={`grid grid-cols-[1fr_103px] gap-5 px-2 py-2 items-center rounded-xl text-sm hover:bg-muted/70 duration-200`}>
      <DialogTrigger asChild>
        <button className={`grid ${isCinemaType ? "grid-cols-2" : "grid-cols-3"} gap-5 items-center`}>
          <Image
            src={iconUrl}
            alt={Name}
            width={80}
            height={32}
            className="rounded object-cover"
          />
          {(highestRes || audioList) && (
            <div className="flex flex-col text-sm truncate">
              {highestRes && <span>{getResolutionIcon(highestRes, 22)}</span>}
              {audioList && (
                <span className="truncate text-left text-gray-400 text-xs">{audioList}</span>
              )}
            </div>
          )}
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="">{typeLabel}</span>
            {Price && <span className="text-xs">{Price}</span>}
          </div>
        </button>
      </DialogTrigger>
      <a href={url}>
        <Button size="sm" variant="outline">{isCinemaType ? "Buy Tickets" : "Watch Now"}</Button>
      </a>
    </li>
  )
}



function capitalizeFirst(str: string): string {
  if (!str) return "";
  const lower = str.toLowerCase();
  return lower[0]?.toUpperCase() + lower.slice(1);
}

function getHighestProviderResolution(resolutions: string[]) {
  if (resolutions.includes("_4K"))
    return "4K"
  else if (resolutions.includes("HD"))
    return "HD"
  else if (resolutions.includes("SD"))
    return "SD"
  else
    return null;
}

function getResolutionIcon(resolution: "4K" | "HD" | "SD", size: number) {
  switch (resolution) {
    case "4K": return <BsBadge4K size={size} />
    case "HD": return <BsBadgeHd size={size} />
    case "SD": return <BsBadgeSd size={size} />
  }
}
