"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { languageCodeToEnglishName } from "@/lib/utils";
import { StreamProvider } from "justwatch-api-client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed
import Image from "next/image";
import { BsBadge4K, BsBadgeHd, BsBadgeSd } from "react-icons/bs";
import { GroupedProvider } from "../actions";
import { sortLanguages } from "@/lib/lang-utils";
import { GiHeadphones } from "react-icons/gi";
import { BsCcSquare } from "react-icons/bs";

export default function JustWatchProviderList({ info: providers }: { info: GroupedProvider[] }) {
  const MAX_INLINE = 4;
  const [open, setOpen] = useState(false);
  const flatStreams: StreamProvider[] = providers.flatMap(item => ungroupProvider(item, true));
  const inlineProviders = flatStreams.slice(0, MAX_INLINE);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ul className="space-y-1 w-full">
        {inlineProviders.map((p) => (
          <ProviderCard provider={p} key={p.Provider} />
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
          {flatStreams.map((p) => (
            <ModalProviderCard provider={p} key={p.Provider} />
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

function ModalProviderCard({ provider }: { provider: StreamProvider }) {
  const {
    Resolution,
    Type,
    Price,
    Provider: providerName,
    Link: url,
    Name,
    Audio = [],
    Subtitle = [],
    Icon: iconUrl
  } = provider;


  const typeLabel = capitalizeFirst(
    Type === "FLATRATE" ? "subscription" : Type.toLowerCase()
  );

  const audioList = Audio.length
    ? sortLanguages(Audio.map(languageCodeToEnglishName)).join(", ")
    : null;
  const subtitleList = Subtitle.length
    ? sortLanguages(Subtitle.map(languageCodeToEnglishName)).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";
  const ctaLabel = isCinemaType ? "Buy Tickets" : "Watch Now";
  const resolution = Resolution === "4K" || Resolution === "HD" || Resolution === "SD" ? Resolution : null

  return (
    <li key={providerName} className="hover:bg-muted/70 duration-200 bg-transparent border" >
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

          {(Resolution || audioList || subtitleList) && (
            <div className="flex flex-col space-y-1 text-sm">
              {resolution && <span>{getResolutionIcon(resolution, 20, "text-amber-300")}</span>}
              {audioList && (
                <div className="flex space-x-2">
                  <div>
                    <GiHeadphones size={20} />
                  </div>
                  <span className="text-xs text-gray-400">{audioList}</span>
                </div>
              )}
              {subtitleList && (
                <div className="flex space-x-2">
                  <div>
                    <BsCcSquare size={20} />
                  </div>
                  <span className="text-xs text-gray-400">{subtitleList}</span>
                </div>
              )}
            </div>
          )}

          <div className={`flex flex-col text-sm ${isCinemaType ?? "col-start-2 row-start-1"}`}>
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

function ProviderCard({ provider }: { provider: StreamProvider }) {
  const {
    Resolution,
    Type,
    Price,
    Provider,
    Link: url,
    Name,
    Audio = [],
    Subtitle = [],
    Icon: iconUrl
  } = provider;

  // const highestRes = useMemo(
  //   () => getHighestProviderResolution(Resolution),
  //   [Resolution]
  // );
  const resolution = Resolution === "4K" || Resolution === "HD" || Resolution === "SD" ? Resolution : null

  const typeLabel =
    capitalizeFirst(Type === "FLATRATE" ? "subscription" : Type);

  const audioList = Audio.length
    ? sortLanguages(Audio.map(languageCodeToEnglishName)).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";
  console.log(Resolution)
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
          {((resolution || audioList) && (
            <div className="flex flex-col text-sm truncate">
              {resolution && <span>{getResolutionIcon(resolution, 22)}</span>}
              {audioList && (
                <div className="flex space-x-2">
                  <GiHeadphones />
                  <span className="truncate text-left text-gray-400 text-xs">{audioList}</span>
                </div>
              )}
            </div>
          ))}
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="">{typeLabel}</span>
            {Price && <span className="text-xs text-gray-400">{Price}</span>}
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

function getResolutionIcon(resolution: "4K" | "HD" | "SD", size: number, className?: string) {
  switch (resolution) {
    case "4K": return <BsBadge4K size={size} className={className ?? ""} />
    case "HD": return <BsBadgeHd size={size} className={className ?? ""} />
    case "SD": return <BsBadgeSd size={size} className={className ?? ""} />
  }
}

export function ungroupProvider(g: GroupedProvider, highestResOnly: boolean): StreamProvider[] {
  const {
    provider: Provider,
    name: Name,
    link: Link,
    icon: Icon,
    types,
    priceByType,
    resolutionsByType,
    audioByType = {},
    subtitleByType = {},
  } = g;

  return types.flatMap((Type) => {
    const Price = priceByType[Type] || "";
    const ResList = resolutionsByType[Type] || [];
    const highestRes = getHighestProviderResolution(ResList);
    const Audio = audioByType[Type] || [];
    const Subtitle = subtitleByType[Type] || [];

    if (highestResOnly && highestRes) {
      return {
        Resolution: highestRes,
        Type,
        Price,
        Provider,
        Link,
        Name,
        Audio,
        Subtitle,
        Icon,
      }
    }

    return ResList.map<StreamProvider>((Resolution) => ({
      Resolution,
      Type,
      Price,
      Provider,
      Link,
      Name,
      Audio,
      Subtitle,
      Icon,
    }));
  });
}
