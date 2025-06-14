import { ReactNode, Suspense } from "react";
import Image from "next/image";
import { fetchTvDetails } from "@/app/(media)/actions";
import { BASE_ORIGINAL_IMAGE_URL, BASE_BLUR_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import PrefetchBannerColor from "../../_components/prefetch-banner-color";

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
  // const blurDataUrl = tv.backdropBlurDataUrl ?? (await getBlurData(`${BASE_BLUR_IMAGE_URL}${tv.backdropPath}`))
  const blurDataUrl = DEFAULT_BLUR_DATA_URL;
  // console.log(`TV layout rendered ${tv.name}`)
  return (

    <div className="relative h-full"
    >
      <div className="absolute top-0 left-0 mb-10 w-screen h-screen -z-50">
        {tv?.backdropPath ? (
          <div className="absolute h-full w-full bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
            <div className="bg-background/40 absolute h-full w-full"></div>
            <Image
              fill
              src={`${BASE_ORIGINAL_IMAGE_URL}${tv.backdropPath}`}
              quality={70}
              alt="header image"
              className={`object-cover -z-50`}
              sizes="100vw"
              placeholder="blur"
              priority
              blurDataURL={blurDataUrl}
            />
          </div>
        ) : (
          <div className="absolute z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-b from-background to-background/50 via-gray-900" />
        )}
      </div>
      {/* <TvProvider tv={tv}> */}
      {children}
      {/* </TvProvider> */}
      <Suspense fallback={null}>
        <PrefetchBannerColor
          backdropPath={tv.backdropPath ?? ""}
          darkVibrantBackdropHex={tv.darkVibrantBackdropHex ?? ""}
        />
      </Suspense>
    </div>
  )
}
