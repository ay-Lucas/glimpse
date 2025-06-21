import type { StreamProvider } from "justwatch-api-client";
import { MAX_RES_BY_PROVIDER } from "./constants.ts";

const RES_ORDER = ["SD", "HD", "_4K"] as const;

export function scrubByMaxRes(streams: StreamProvider[]): StreamProvider[] {
  return streams.filter((s) => {
    const max = MAX_RES_BY_PROVIDER[s.Provider];
    if (!max) return true;  // no override → keep everything

    const idx = RES_ORDER.indexOf(s.Resolution as any);
    const maxIdx = RES_ORDER.indexOf(max);
    // only keep if this resolution is <= the allowed max
    return idx !== -1 && idx <= maxIdx;
  });
}
