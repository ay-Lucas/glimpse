// src/lib/recs/ranked.ts
import { Candidate } from "@/types/camel-index";

export interface RankResult {
  id: number;
  score: number;
  reason: string;
}

/**
 *  Ensures:
 *   • no duplicate IDs in `ranked`
 *   • exactly `target` items
 *   • fills gaps from `scoredPool` (already sorted by relevance)
 */
export function dedupeAndTopUp(
  ranked: RankResult[],
  scoredPool: Candidate[],
  target = 15
): RankResult[] {
  const seen = new Set<number>();
  const unique: RankResult[] = [];

  // 1) keep first occurrence of each id
  for (const r of ranked) {
    if (!seen.has(r.id)) {
      unique.push(r);
      seen.add(r.id);
    }
    if (unique.length === target) return unique;
  }

  // 2) top-up with spare candidates (lowest boost, generic reason)
  for (const c of scoredPool) {
    if (seen.has(c.id)) continue;
    unique.push({
      id: c.id,
      score: 0.4,
      reason: "additional pick",
    });
    seen.add(c.id);
    if (unique.length === target) break;
  }

  return unique;
}
