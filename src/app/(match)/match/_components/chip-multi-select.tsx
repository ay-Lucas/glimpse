"use client";
import { Badge } from "@/components/ui/badge";

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
        {options.map((opt) => (
          <Badge
            key={opt}
            onClick={() => toggle(opt)}
            className={`cursor-pointer text-xs ${
              selected.includes(opt)
                ? "bg-cyan-500 text-white shadow"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {opt}
          </Badge>
        ))}
      </div>
      {max && (
        <p className="text-xs text-muted-foreground">
          {selected.length}/{max} selected
        </p>
      )}
    </div>
  );
}
