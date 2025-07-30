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

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
export default function MoodGrid({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (m: string) => void;
}) {
  const id = useId();
  // return (
  //   <div
  //     className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
  //     role="radiogroup"
  //     aria-labelledby={id}
  //   >
  //     {MOODS.map((m) => (
  //       <Badge
  //         key={m}
  //         role="radio"
  //         aria-checked={selected === m}
  //         onClick={() => onSelect(m)}
  //         className={`cursor-pointer text-sm text-white transition ${
  //           selected === m
  //             ? "bg-cyan-500 text-white shadow-lg"
  //             : "bg-white/10 hover:bg-white/20"
  //         }`}
  //       >
  //         {m}
  //       </Badge>
  //     ))}
  //   </div>
  // );

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {MOODS.map((m) => {
          return (
            <motion.button
              key={m}
              role="radio"
              aria-checked={selected === m}
              layout // smooth re-ordering
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => onSelect(m)}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                "transition-colors duration-200",
                selected === m
                  ? "bg-cyan-600 text-white shadow shadow-cyan-400/30"
                  : "bg-white/10 hover:bg-white/20"
              )}
            >
              {m}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
