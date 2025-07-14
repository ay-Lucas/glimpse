export function capitalizeFirst(str: string): string {
  if (!str) return "";
  const lower = str.toLowerCase();
  return lower[0]?.toUpperCase() + lower.slice(1);
}
