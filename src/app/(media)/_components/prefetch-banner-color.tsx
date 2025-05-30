import { bannerColor } from "@/lib/bannerColor";

export default async function PrefetchBannerColor({
  backdropPath,
  darkVibrantBackdropHex,
}: {
  backdropPath: string;
  darkVibrantBackdropHex?: string;
}) {
  // kick off the promise, but never await it
  bannerColor(backdropPath, darkVibrantBackdropHex);
  return null;
}
