"use client";
/*
 * MoodMatch V2 — AI-infused aesthetic
 * • Three primary panels (Mood → Vibe/Aesthetic → Interests)
 * • Collapsible "Advanced" footer for power filters
 * • Frosted-glass cards on a subtle aurora gradient background
 */
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import ChipMultiSelect from "./_components/chip-multi-select";
import MoodGrid from "./_components/mood-grid";
import TagInput from "./_components/tag-input";
import { buildPayload, MoodState } from "@/lib/recs/payload";
import { CandidateResponse } from "@/types/camel-index";
import ResultsGrid from "./_components/results-grid";
import { payloadToSearch } from "@/lib/recs/query";

// ───────── placeholder data ─────────────────────────────────────────
const VIBES = [
  "dark comedy",
  "slow-burn",
  "slice-of-life",
  "coming-of-age",
  "high-octane",
  "bittersweet",
  "surreal",
  "campy",
  "gritty",
  "heart-warming",
] as const;
const AESTHETICS = [
  "rainy-day",
  "retro-80s",
  "film-noir",
  "neon",
  "cottagecore",
  "cyberpunk",
  "road-trip",
  "holiday",
  "coastal",
  "space-opera",
] as const;

export function searchToState(qs: URLSearchParams): MoodState {
  const mood = qs.get("mo");
  return {
    mood,
    vibe: qs.getAll("vi"),
    aesthetic: qs.getAll("ae"),
    interests: qs.getAll("in"),
    includeSeries: qs.get("m") !== "movie",
    yearRange: (qs.get("y")?.split("-").map(Number) as [number, number]) ?? [
      1990, 2025,
    ],
    runtime: Number(qs.get("r") ?? 120),
    language: qs.getAll("l").length ? qs.getAll("l") : ["en"],
    avoid: qs.getAll("x"),
  };
}

export default function MoodMatchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = useMemo(() => searchToState(params), [params]);
  const [mood, setMood] = useState<string | null>(initial.mood);
  const [vibe, setVibe] = useState<string[]>(initial.vibe);
  const [aesthetic, setAesthetic] = useState<string[]>(initial.aesthetic);
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [advOpen, setAdvOpen] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>(
    initial.yearRange
  );
  const [runtime, setRuntime] = useState<number>(initial.runtime);
  const [includeSeries, setIncludeSeries] = useState(initial.includeSeries);
  const [loading, start] = useTransition();
  const [results, setResults] = useState<CandidateResponse[]>([]);

  async function submit() {
    start(async () => {
      const payload = buildPayload({
        mood,
        vibe,
        aesthetic,
        interests,
        includeSeries,
        yearRange,
        runtime,
        language: ["en"],
        avoid: [],
      });
      setResults([]);
      const qs = payloadToSearch(payload);
      router.replace(`/match?${qs}`); // updates URL without full reload
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error(res);
      }
      const json = (await res.json()) as CandidateResponse[];
      setResults(json);
    });
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#1a2a49] text-slate-100">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,185,255,0.35),transparent_45%)]"></div>

      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-6">
        <Sparkles className="h-7 w-7 text-cyan-400 drop-shadow" />
        <h1 className="text-2xl font-semibold tracking-tight">MoodMatch</h1>
        <div className="ml-auto md:hidden">
          <Sheet open={advOpen} onOpenChange={setAdvOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[80%] overflow-auto bg-background/90 backdrop-blur-lg"
            >
              <AdvancedPanel
                yearRange={yearRange}
                setYearRange={setYearRange}
                runtime={runtime}
                setRuntime={setRuntime}
                includeSeries={includeSeries}
                setIncludeSeries={setIncludeSeries}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-4 md:grid-cols-3 md:gap-8">
        {/* Panel 1 – Mood */}
        <Card className={panelClass() + (mood ? " ring-2 ring-cyan-400" : "")}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-medium">1. Pick the core feeling</h2>
            <MoodGrid selected={mood} onSelect={setMood} />
          </CardContent>
        </Card>

        {/* Panel 2 – Vibe / Aesthetic */}
        <Card className={panelClass()}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-medium">2. Fine-tune the vibe</h2>
            <ChipMultiSelect
              label="Vibe"
              options={VIBES}
              selected={vibe}
              onChange={setVibe}
              max={3}
            />
            <ChipMultiSelect
              label="Aesthetic"
              options={AESTHETICS}
              selected={aesthetic}
              onChange={setAesthetic}
              max={2}
            />
          </CardContent>
        </Card>

        {/* Panel 3 – Interests */}
        <Card className={panelClass()}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-medium">3. Interests & topics</h2>
            <TagInput
              selected={interests}
              onChange={setInterests}
              placeholder="e.g. chess, true crime, surfing"
            />
          </CardContent>
        </Card>
      </main>

      {/* Advanced on desktop */}
      <div className="mx-auto hidden max-w-6xl px-4 pb-4 md:block">
        <AdvancedPanel
          yearRange={yearRange}
          setYearRange={setYearRange}
          runtime={runtime}
          setRuntime={setRuntime}
          includeSeries={includeSeries}
          setIncludeSeries={setIncludeSeries}
        />
      </div>
      <div className="mx-auto grid max-w-6xl p-4">
        <ResultsGrid items={results} loading={loading} />
      </div>

      <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
        <Button
          size="lg"
          disabled={!mood || loading}
          className="px-10 text-lg shadow-lg shadow-cyan-500/30"
          onClick={submit}
        >
          {loading ? "Matching…" : "Get Matches"}
        </Button>
      </div>
    </div>
  );
}

// ───────── sub components ────────────────────────────────────────────

function panelClass() {
  return cn(
    "backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-inner shadow-cyan-300/5"
  );
}

type AdvProps = {
  yearRange: [number, number];
  setYearRange: (v: [number, number]) => void;
  runtime: number;
  setRuntime: (v: number) => void;
  includeSeries: boolean;
  setIncludeSeries: (v: boolean) => void;
};
function AdvancedPanel({
  yearRange,
  setYearRange,
  runtime,
  setRuntime,
  includeSeries,
  setIncludeSeries,
}: AdvProps) {
  return (
    <div className="mt-4 space-y-6 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-2 flex items-center gap-2 text-base font-medium">
        <SlidersHorizontal className="h-4 w-4" /> Advanced filters
      </h3>
      <div className="space-y-4">
        {/* Era */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Era</label>
          <Slider
            min={1950}
            max={2025}
            value={yearRange}
            // range
            step={5}
            onValueChange={(v) => setYearRange(v as [number, number])}
          />
          <p className="text-xs text-muted-foreground">
            {yearRange[0]} – {yearRange[1]}
          </p>
        </div>
        {/* Runtime */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Max runtime (min)</label>
          <Slider
            min={60}
            max={240}
            value={[runtime]}
            onValueChange={(v) => v[0] && setRuntime(v[0])}
          />
          <p className="text-xs text-muted-foreground">≤ {runtime} min</p>
        </div>
        {/* Media type toggle */}
        <div className="flex items-center gap-3">
          <Switch checked={includeSeries} onCheckedChange={setIncludeSeries} />
          <span className="text-sm">Include series</span>
        </div>
      </div>
    </div>
  );
}
