
import { Button } from "@/components/ui/button";
import { languageCodeToEnglishName } from "@/lib/utils";
import { StreamingInfo, StreamProvider } from "justwatch-api-client";
import Image from "next/image";

export default function ProviderList({ info }: { info: StreamingInfo }) {
  // 1. Build a map of provider → first‐seen stream entry
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
  const uniqueProviders = Object.values(providerMap);
  // const resolutions = info.Streams.map(item => item.Resolution)
  return (
    <ul className="space-y-1 w-full">
      {uniqueProviders.map((p) => (
        <ProviderCard provider={p} resolutions={resolutions.get(p.Provider) ?? []} />
      ))}
    </ul>
  );
}

function ProviderCard({ provider, resolutions }: { provider: StreamProvider, resolutions: string[] }) {
  const highestRes = getHighestProviderResolution(resolutions);

  const typeLabel =
    capitalizeFirst(provider.Type === "FLATRATE" ? "subscription" : provider.Type);
  return (
    // <li className={`grid ${provider.Type === "CINEMA" ? "grid-cols-3" : "grid-cols-4"} gap-5 px-2 py-2 items-center bg-background/70 rounded-xl text-sm`}>
    <li className={`grid grid-cols-4 gap-5 px-2 py-2 items-center bg-background/70 rounded-xl text-sm`}>
      {/* <li className={`flex w-full justify-between px-2 py-2 items-center bg-background/70 rounded-xl text-sm`}> */}
      <Image
        src={provider.Icon}
        alt={provider.Name}
        width={80}
        height={32}
        className="rounded object-cover"
      />
      {(highestRes || provider.Audio.length > 0) && (
        <div className="flex flex-col">
          <p className="truncate">{highestRes}</p>
          <p className="truncate text-xs text-gray-400">
            {provider.Audio?.map((a, i) => (
              <span key={i}>
                {languageCodeToEnglishName(a)}
                {i < provider.Audio.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      )}
      <div className="flex flex-col items-start whitespace-nowrap">
        <span className="">{typeLabel}</span>
        {provider.Price && <span className="text-xs">{provider.Price}</span>}
      </div>

      <a href={provider.Link}>
        {/* <Button size="sm" variant="outline">{provider.Type.toString()}</Button> */}
        <Button size="sm" variant="outline">{provider.Type.toString() === "CINEMA" ? "Buy Tickets" : "Watch Now"}</Button>
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
