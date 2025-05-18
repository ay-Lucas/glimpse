import { MovieResult, TvResult, Cast, Episode } from "@/types/request-types";
import { getPlaiceholder } from "plaiceholder";
import { BaseImageUrl, DEFAULT_BLUR_DATA_URL, options } from "./constants";

async function getBlurData(src: string) {
  try {
    const res = await fetch(src, options);
    if (!res.ok) {
      throw new Error(`Failed to fetch blur image: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await getPlaiceholder(buffer);
    return data.base64;
  } catch (error: unknown) {
    if (
      error instanceof TypeError &&
      (error as any).cause?.code === "ERR_TLS_CERT_ALTNAME_INVALID"
    ) {
      console.warn(`Ignoring TLS alt-name mismatch for ${src}, falling back…`);
    }
    return DEFAULT_BLUR_DATA_URL;
  }
}

export async function appendBlurDataToMediaArray(
  items: Array<MovieResult | TvResult | Cast | Episode>,
  baseImageUrl: BaseImageUrl,
  imagePathArray: Array<String | undefined | null>,
) {
  const itemsWithBlur = await Promise.all(
    items.map(async (item, index) => {
      let blurDataURL;
      const imagePath = imagePathArray.at(index);
      if (
        imagePath !== undefined &&
        imagePath !== "" &&
        imagePath !== null &&
        imagePath.length > 0
      ) {
        const blurData = await getBlurData(`${baseImageUrl}${imagePath}`);
        blurDataURL = blurData;
      } else {
        blurDataURL = DEFAULT_BLUR_DATA_URL;
      }
      return {
        ...item,
        blurDataURL: blurDataURL,
      };
    }),
  );

  return itemsWithBlur;
}

export { getBlurData };
