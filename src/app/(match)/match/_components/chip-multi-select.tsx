"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";

export default function ChipMultiSelect({
  label,
  options,
  selected,
  onChange,
  max,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (!max || selected.length < max) {
      onChange([...selected, tag]);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt);

            return (
              <motion.button
                key={opt}
                layout // smooth re-ordering
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => toggle(opt)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  "transition-colors duration-200",
                  isSelected
                    ? "bg-cyan-600 text-white shadow shadow-cyan-400/30"
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {opt}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      {max && (
        <p className="text-xs text-muted-foreground">
          {selected.length}/{max} selected
        </p>
      )}
    </div>
  );
}
