import { languageCodeToEnglishName } from "@/lib/utils";

const PRIORITY: string[] = ["en", "es", "fr", "de", "zh", "ja"];

export function sortLanguages(codes: string[]): string[] {
  // Dedupe just in case
  const uniq = Array.from(new Set(codes));

  return uniq.sort((a, b) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);

    // if one is priority and the other isn’t, priority goes first
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }

    // neither is priority, sort by their English names
    const nameA = languageCodeToEnglishName(a);
    const nameB = languageCodeToEnglishName(b);
    return nameA.localeCompare(nameB);
  });
}
