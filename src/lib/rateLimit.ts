const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimitedEdge(ip: string, route: string) {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window
  const maxHits = 150;
  const entry = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now >= entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
  } else {
    entry.count++;
  }
  buckets.set(key, entry);

  return entry.count > maxHits;
}
