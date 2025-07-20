/**
 * Returns a Date set to today at 00:00:00 in the local timezone.
 */
function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/**
 * Has this ISO date (releaseDate, airDate, etc.) already passed?
 * @param isoDate — an ISO-8601 string like "2025-07-20" or full timestamp
 */
export function isPast(isoDate: string): boolean {
  const d = new Date(isoDate);
  // normalize the incoming date to local midnight too
  d.setHours(0, 0, 0, 0);
  return d < startOfToday();
}

/**
 * Is this date today or sometime in the future?
 * (i.e. release/air date has not yet come, or is right now)
 */
export function isTodayOrFuture(isoDate: string): boolean {
  const d = new Date(isoDate);
  d.setHours(0, 0, 0, 0);
  return d >= startOfToday();
}
export function toDateString(value?: string | Date | null): string | null {
  if (value == null) return null; // catch undefined or null

  // if it’s already a Date, use it; otherwise parse the string
  const d = value instanceof Date ? value : new Date(value);
  // invalid‐date guard
  if (isNaN(d.getTime())) return null;
  // return only the YYYY-MM-DD part
  return d.toISOString().split("T")[0] ?? null;
}
export function isValidDateString(s: string | null | undefined): boolean {
  if (!s) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}
