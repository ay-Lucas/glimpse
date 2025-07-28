"use client";
/** TagInput v2 – smoother UX, backspace remove, dup check, max cap */
import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function TagInput({
  selected,
  onChange,
  placeholder = "e.g. chess, true crime, surfing",
  max = 12,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  // ─── helpers ────────────────────────────────────────────────────────
  const norm = (s: string) => s.trim().toLowerCase();
  const unique = (arr: string[]) => [...new Set(arr.map(norm))];

  function commit(raw: string) {
    if (!raw) return;

    const parts = raw
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, max - selected.length);

    if (!parts.length) return;

    const merged = unique([...selected, ...parts]).slice(0, max);
    onChange(merged);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(selected.filter((t) => norm(t) !== norm(tag)));
  }

  // ─── render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {selected.map((tag) => (
            <li key={tag}>
              <Badge className="flex items-center gap-1 bg-cyan-600 text-white">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => remove(tag)}
                />
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {selected.length < max && (
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            const last = selected.at(-1);
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Backspace" && !draft && last) remove(last);
          }}
          onBlur={() => commit(draft)}
          maxLength={32}
          className="w-full bg-white/10 focus:bg-white/20"
        />
      )}
      <p className="text-xs text-muted-foreground">
        {selected.length}/{max} tags
      </p>
    </div>
  );
}
