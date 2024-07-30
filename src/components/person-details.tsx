"use client";
import { Genre } from "@/types/types";
import Image from "next/image";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Expandable({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const CLAMPED_CLIENT_HEIGHT = 144;
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandable, setExpandable] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setExpandable((ref.current?.clientHeight ?? 0) >= CLAMPED_CLIENT_HEIGHT);
    console.log(ref.current?.clientHeight);
  }, []);
  return (
    <div
      className={`text-md text-start leading-6 select-text transition-transform ${isOpen ? "max-h-full" : "max-h-48 overflow-hidden "}`}
    >
      <span ref={ref} className={`${isOpen ? "" : "line-clamp-6"} `}>
        {content}
      </span>
      <div className="flex w-full justify-end">
        <button onClick={handleIsOpen} disabled={!isExpandable}>
          <ChevronDown
            className={`dark:brightness-50  ease-in-out transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${ref.current && ref.current.clientHeight >= CLAMPED_CLIENT_HEIGHT ? "opacity-100" : "opacity-0"}`}
          />
        </button>
      </div>
    </div>
  );
}

export function PersonDetails({
  name,
  biography,
  birthDate,
  popularity,
  deathDay,
  knownForDept,
  placeOfBirth,
  paramsId,
}: {
  name?: string;
  biography?: string;
  birthDate?: string | null;
  popularity?: number;
  deathDay?: string | null;
  knownForDept?: string | null;
  placeOfBirth?: string | null;
  paramsId?: number;
}) {
  let birthYear, deathYear, formattedDeathDate, age;
  const formattedBirthDate = new Intl.DateTimeFormat("us", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
    day: "numeric",
  }).format(new Date(birthDate!));

  if (deathDay !== null) {
    formattedDeathDate = new Intl.DateTimeFormat("us", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
      day: "numeric",
    }).format(new Date(deathDay!));
    birthYear = formattedBirthDate.split(", ")[1];
    deathYear = formattedDeathDate.split(", ")[1];
  }
  if (birthDate !== null && birthDate) {
    let miliseconds = new Date().valueOf() - new Date(birthDate).valueOf();
    let years = miliseconds / 1000 / 60 / 60 / 24 / 365;
    age = years.toString().split(".")[0];
  }

  return (
    <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
      <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start pb-2">
        {deathDay !== null ? `${name} (${birthYear} - ${deathYear})` : name}
      </h2>
      <div className="flex flex-col text-lg items-start justify-center md:justify-start">
        {birthDate && (
          <div>
            <span>Born: {formattedBirthDate} </span>
            <>{placeOfBirth && <span>in {placeOfBirth}</span>}</>
          </div>
        )}
        {deathDay && <span>Died: {formattedDeathDate}</span>}
        {age && <span>Age: {age}</span>}
        {knownForDept && <span>Known for: {knownForDept}</span>}
        <div className="inline-flex items-center">
          <span className="mr-2">
            Popularity: {Math.round(popularity ?? 0)}
          </span>
          <>{/* <span>•</span> */}</>
        </div>
      </div>
      <br />
      <div className="text-md md:text-lg font-medium">
        {<Expandable content={biography!} />}
      </div>
    </div>
  );
}
