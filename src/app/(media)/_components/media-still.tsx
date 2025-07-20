import Image from "next/image";
import {
  BASE_MEDIUM_STILL_IMAGE_URL,
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";

interface MediastillProps {
  stillPath: string | null;
  title: string;
}

export function MediaStill({ stillPath, title }: MediastillProps) {
  if (!stillPath) {
    return <div className="h-[357px] w-[238px] bg-gray-800/20" />;
  }

  return (
    <figure
      className={`group relative inset-0 mt-1 aspect-[16/9] w-full items-end rounded-lg`}
    >
      <Image
        fill
        src={`${BASE_ORIGINAL_IMAGE_URL}${stillPath}`}
        className={`inset-0 rounded-lg object-cover transition-opacity duration-300`}
        // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 100vw"
        priority
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_DATA_URL}
        alt={`${title} still`}
        loading="eager"
        sizes="300px"
      />
    </figure>
  );
}
