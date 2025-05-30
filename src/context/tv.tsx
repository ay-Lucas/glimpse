"use client";
import { createContext, ReactNode, useContext } from "react";
import type { FullTv } from "@/types/camel-index";

export const TvContext = createContext<FullTv | null>(null);
export const useTv = () => {
  const tv = useContext(TvContext);
  if (!tv) throw new Error("`useTv` must be inside TvLayout");
  return tv;
};

export function TvProvider({ tv, children }: { tv: FullTv; children: ReactNode }) {
  console.log("tv provider called")
  return <TvContext.Provider value={tv}>{children}</TvContext.Provider>;
}
