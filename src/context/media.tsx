"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import type { FullMovie, FullPerson, FullTv } from "@/types/camel-index";

interface MediaContextValue {
  tv?: FullTv;
  movie?: FullMovie;
  person?: FullPerson;
  setTv: (tv: FullTv) => void;
  setMovie: (movie: FullMovie) => void;
  setPerson: (person: FullPerson) => void;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be inside MediaProvider");
  return ctx;
};

export function MediaProvider({
  initialTv,
  initialMovie,
  initialPerson,
  children,
}: {
  initialTv?: FullTv;
  initialMovie?: FullMovie;
  initialPerson?: FullPerson;
  children: ReactNode;
}) {
  const [tv, setTv] = useState<FullTv | undefined>(initialTv);
  const [movie, setMovie] = useState<FullMovie | undefined>(initialMovie);
  const [person, setPerson] = useState<FullPerson | undefined>(initialPerson);

  return (
    <MediaContext.Provider
      value={{ tv, movie, person, setTv, setMovie, setPerson }}
    >
      {children}
    </MediaContext.Provider>
  );
}
