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
import { sortLanguages } from "@/lib/lang-utils";
import { GiHeadphones } from "react-icons/gi";
import { BsCcSquare } from "react-icons/bs";
import { GroupedProvider } from "@/types/camel-index";
import { capitalizeFirst } from "@/lib/strings";

export default function JustWatchProviderList({
  info,
}: {
  info: GroupedProvider[];
}) {
  const MAX_INLINE = 4;
  const [open, setOpen] = useState(false);
  const providers: StreamProvider[] = info.flatMap((item) =>
    ungroupProvider(item, true)
  );
  const inlineProviders = providers.slice(0, MAX_INLINE);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ul className="w-full space-y-1">
        {inlineProviders.map((p) => (
          <ProviderCard provider={p} key={`${p.Provider}:${p.Type}`} />
        ))}
      </ul>
      {providers.length > MAX_INLINE && (
        <DialogTrigger asChild>
          <Button variant="link" size="sm" className="text-md">
            +{providers.length - MAX_INLINE} more
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-[90vw] lg:max-w-5xl">
        <DialogTitle>All Providers</DialogTitle>
        <ul className="space-y-0">
          {providers.map((p) => (
            <ModalProviderCard provider={p} key={`${p.Provider}:${p.Type}`} />
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
    Icon: iconUrl,
  } = provider;

  const typeLabel = capitalizeFirst(
    Type === "FLATRATE" ? "subscription" : Type.toLowerCase()
  );

  const audioList = Audio.length
    ? // ? sortLanguages(Audio.map(languageCodeToEnglishName)).join(", ")
      sortLanguages(Audio.map(languageCodeToEnglishName)).join(", ")
    : null;
  const subtitleList = Subtitle.length
    ? sortLanguages(Subtitle.map(languageCodeToEnglishName)).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";
  const ctaLabel = isCinemaType ? "Buy Tickets" : "Watch Now";
  const resolution =
    Resolution === "4K" || Resolution === "HD" || Resolution === "SD"
      ? Resolution
      : null;

  return (
    <li
      key={providerName}
      className="border bg-transparent p-1 duration-200 hover:bg-muted/70"
    >
      <div className="grid grid-cols-[minmax(100px,150px),1fr] items-center">
        <div className="">
          {iconUrl && (
            <Image
              src={iconUrl}
              alt={`${Name} logo`}
              width={100}
              height={40}
              className="rounded object-cover"
            />
          )}
        </div>
        <div className="grid grid-cols-[minmax(150px,600px),minmax(20px,50px),minmax(103px,150px)] gap-4 p-2 sm:grid-cols-[minmax(150px,600px),minmax(20px,50px),minmax(80px,150px),minmax(103px,125px)]">
          <div className="flex items-center space-x-2">
            {audioList && (
              <>
                <div>
                  <GiHeadphones size={22} />
                </div>
                <span className="text-xs text-gray-400">{audioList}</span>
              </>
            )}
          </div>
          <div className="row-start-2 flex items-center space-x-2">
            {subtitleList && (
              <>
                <div>
                  <BsCcSquare size={22} />
                </div>
                <span className="text-xs text-gray-400">{subtitleList}</span>
              </>
            )}
          </div>
          <div className="">
            {resolution && <span>{getResolutionIcon(resolution, 22)}</span>}
          </div>

          <div className={`flex flex-col pl-3 text-sm sm:pl-0`}>
            <span className="font-medium">{typeLabel}</span>
            {Price && (
              <span className="text-xs text-muted-foreground">{Price}</span>
            )}
          </div>
          <div className="col-start-3 text-left sm:col-start-4">
            <a href={url}>
              <Button size="sm" variant="outline">
                {ctaLabel}
              </Button>
            </a>
          </div>
        </div>
      </div>
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
    Icon: iconUrl,
  } = provider;

  // const highestRes = useMemo(
  //   () => getHighestProviderResolution(Resolution),
  //   [Resolution]
  // );
  const resolution =
    Resolution === "4K" || Resolution === "HD" || Resolution === "SD"
      ? Resolution
      : null;

  const typeLabel = capitalizeFirst(
    Type === "FLATRATE" ? "subscription" : Type
  );

  const audioList = Audio.length
    ? sortLanguages(Audio.map(languageCodeToEnglishName)).join(", ")
    : null;

  const isCinemaType = Type === "CINEMA";
  return (
    <li
      className={`grid grid-cols-[1fr_103px] items-center gap-5 rounded-xl px-2 py-2 text-sm duration-200 hover:bg-muted/70`}
    >
      <DialogTrigger asChild>
        <button className={`grid grid-cols-3 items-center gap-5`}>
          <Image
            src={iconUrl}
            alt={Name}
            width={80}
            height={32}
            className="rounded object-cover"
          />
          <div className="flex flex-col truncate text-sm">
            {(resolution || audioList) && (
              <>
                {resolution && <span>{getResolutionIcon(resolution, 22)}</span>}
                {audioList && (
                  <div className="flex space-x-2">
                    <div>
                      <GiHeadphones />
                    </div>
                    <span className="truncate text-left text-xs text-gray-400">
                      {audioList}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="">{typeLabel}</span>
            {Price && <span className="text-xs text-gray-400">{Price}</span>}
          </div>
        </button>
      </DialogTrigger>
      <a href={url}>
        <Button size="sm" variant="outline">
          {isCinemaType ? "Buy Tickets" : "Watch Now"}
        </Button>
      </a>
    </li>
  );
}

function getHighestProviderResolution(resolutions: string[]) {
  if (resolutions.includes("_4K")) return "4K";
  else if (resolutions.includes("HD")) return "HD";
  else if (resolutions.includes("SD")) return "SD";
  else return null;
}

function getResolutionIcon(
  resolution: "4K" | "HD" | "SD",
  size: number,
  className?: string
) {
  switch (resolution) {
    case "4K":
      return <BsBadge4K size={size} className={className ?? ""} />;
    case "HD":
      return <BsBadgeHd size={size} className={className ?? ""} />;
    case "SD":
      return <BsBadgeSd size={size} className={className ?? ""} />;
  }
}

export function ungroupProvider(
  g: GroupedProvider,
  highestResOnly: boolean
): StreamProvider[] {
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
      };
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
