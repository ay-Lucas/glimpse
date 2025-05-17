import { MovieResult, TvResult, Cast, Episode } from "@/types/request-types";
import { getPlaiceholder } from "plaiceholder";
import { BaseImageUrl, DEFAULT_BLUR_DATA_URL } from "./constants";

async function getBlurData(src: string) {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const data = await getPlaiceholder(buffer);
  return data;
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
      if (imagePath !== undefined && imagePath !== "" && imagePath !== null) {
        const blurData = await getBlurData(`${baseImageUrl}${imagePath}`);
        blurDataURL = blurData.base64;
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
