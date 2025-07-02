import { BASE_CAST_IMAGE_URL } from "@/lib/constants";
import Image from "next/image";

interface CastCardProps {
  name?: string;
  character?: string;
  imagePath: string | null | undefined;
  index: number;
  className?: string;
  blurDataURL: string;
}

export default function CastCard({
  name,
  character,
  imagePath,
  index,
  className = "",
  blurDataURL,
}: CastCardProps) {
  return (
    <div
      className={`${className} w-fit select-none justify-center rounded-full shadow-xl transition-transform duration-150 group-hover:scale-110`}
    >
      {imagePath ? (
        <Image
          src={`${BASE_CAST_IMAGE_URL}${imagePath}`}
          alt={`${name} as ${character}`}
          key={index}
          width={150}
          height={225}
          loading="lazy"
          quality={100}
          placeholder="blur"
          // blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
          blurDataURL={blurDataURL}
          sizes="150px"
          className="rounded-md object-cover"
        />
      ) : (
        <div className="h-[225px] w-[150px] rounded-md bg-gray-200" />
      )}

      <div className="mt-2 text-start">
        <p className="line-clamp-1 text-sm font-semibold">{name}</p>
        <p className="line-clamp-1 text-sm text-gray-500">as {character}</p>
      </div>
    </div>
  );
}
