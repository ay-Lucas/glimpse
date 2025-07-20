import Image from "next/image";
import { BASE_POSTER_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";

interface MediaPosterProps {
  posterPath: string | null;
  posterBlur: string | null;
  title: string;
}

export function MediaPoster({
  posterPath,
  posterBlur,
  title,
}: MediaPosterProps) {
  if (!posterPath) {
    return <div className="h-[357px] w-[238px] bg-gray-800/20" />;
  }

  return (
    <figure className="relative mx-auto h-[238px] w-[159px] md:h-[357px] md:w-[238px]">
      <Image
        quality={70}
        fill
        src={`${BASE_POSTER_IMAGE_URL}${posterPath}`}
        className="rounded-lg object-cover"
        priority
        placeholder="blur"
        blurDataURL={posterBlur ?? DEFAULT_BLUR_DATA_URL}
        alt={`${title} poster`}
        loading="eager"
        sizes="159px"
      />
    </figure>
  );
}
