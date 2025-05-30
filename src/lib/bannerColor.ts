import { Vibrant } from "node-vibrant/node";
import { BASE_ORIGINAL_IMAGE_URL } from "./constants";
import { unstable_cache } from "next/cache";

export const bannerColor = unstable_cache(
  async (backdropPath: string, darkVibrantHex?: string) => {
    if (darkVibrantHex?.trim()) return darkVibrantHex;
    const palette = await Vibrant.from(
      BASE_ORIGINAL_IMAGE_URL + backdropPath
    ).getPalette();
    const [r, g, b] = palette.DarkVibrant?.rgb ?? [0, 0, 0];
    console.log("bannerColor called")
    return `rgba(${r},${g},${b},0.9)`;
  }, [],
  {
    revalidate: 36000
  }
);
