import { ReactNode } from "react";
import Image from "next/image";
import { fetchTvDetails } from "@/app/(media)/actions";
import {
  BASE_ORIGINAL_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { getRedisBlurValue } from "@/services/cache";

export const revalidate = 43200; // 12 hours

export default async function TvLayout({
  params,
  children,
}: {
  params: { id: number };
  children: ReactNode;
}) {
  const tmdbId = params.id;
  const tv = await fetchTvDetails(tmdbId);
  const blurData = await getRedisBlurValue("tv", params.id);
  // console.log(`TV layout rendered ${tv.name}`)
  return (
    <div className="relative h-full">
      <div className="absolute left-0 top-0 -z-50 mb-10 h-screen w-full">
        {tv?.backdropPath ? (
          <div className="absolute h-full w-full bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
            <div className="absolute h-full w-full bg-background/40"></div>
            <Image
              fill
              src={`${BASE_ORIGINAL_IMAGE_URL}${tv.backdropPath}`}
              quality={70}
              alt="header image"
              className={`-z-50 object-cover`}
              sizes="100vw"
              placeholder="blur"
              priority
              blurDataURL={blurData?.backdropBlur ?? DEFAULT_BLUR_DATA_URL}
            />
          </div>
        ) : (
          <div className="absolute left-0 top-0 z-0 h-full w-full items-center justify-center bg-gradient-to-b from-background via-gray-900 to-background/50" />
        )}
      </div>
      {/* <TvProvider tv={tv}> */}
      {children}
      {/* </TvProvider> */}
      {/* <Suspense fallback={null}> */}
      {/*   <PrefetchBannerColor */}
      {/*     backdropPath={tv.backdropPath ?? ""} */}
      {/*     darkVibrantBackdropHex={tv.darkVibrantBackdropHex ?? ""} */}
      {/*   /> */}
      {/* </Suspense> */}
    </div>
  );
}
