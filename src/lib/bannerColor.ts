import { Vibrant } from "node-vibrant/node";
import { BASE_SMALL_BACKDROP_URL } from "./constants";
import { unstable_cache } from "next/cache";

export const bannerColor = unstable_cache(
  async function getBannerColor(
    backdropPath: string,
    darkVibrantHex?: string
  ) {
    if (darkVibrantHex?.trim()) return darkVibrantHex;
    // console.log("computing bannerColor for", backdropPath);

    try {
      const raw = await Promise.race([
        Vibrant.from(BASE_SMALL_BACKDROP_URL + backdropPath).getPalette(),
        new Promise<unknown>((_, reject) =>
          setTimeout(() => reject(new Error("palette-timeout")), 2_000)
        ),
      ]);
      const palette = raw as { DarkVibrant?: { rgb: [number, number, number] } };
      const [r, g, b] = palette.DarkVibrant?.rgb ?? [0, 0, 0];
      return `rgba(${r},${g},${b},0.9)`;
    } catch {
      return "rgba(0,0,0,0.7)";
    }
  }, [],
  {
    revalidate: 43200
  }
);
