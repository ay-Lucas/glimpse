"use client";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";

const MOODS = [
  "cozy",
  "tense",
  "melancholic",
  "feel-good",
  "nostalgic",
  "adrenaline",
  "eerie",
  "whimsical",
  "romantic",
  "uplifting",
  "tragic",
  "mind-bending",
] as const;

export default function MoodGrid({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (m: string) => void;
}) {
  const id = useId();
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      role="radiogroup"
      aria-labelledby={id}
    >
      {MOODS.map((m) => (
        <Badge
          key={m}
          role="radio"
          aria-checked={selected === m}
          onClick={() => onSelect(m)}
          className={`cursor-pointer text-sm transition ${
            selected === m
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {m}
        </Badge>
      ))}
    </div>
  );
}
