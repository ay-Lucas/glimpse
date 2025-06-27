import { BASE_CAST_IMAGE_URL } from "@/lib/constants";
import Image from "next/image";

interface CastCardProps {
  name?: string;
  character?: string;
  imagePath?: string;
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
      className={`${className} 
                  select-none rounded-full shadow-xl 
                  transition-transform duration-150 group-hover:scale-110 justify-center w-fit`}
    >
      {imagePath ? (
        <Image
          src={`${BASE_CAST_IMAGE_URL}${imagePath}`}
          alt={`${name} as ${character}`}
          key={index}
          width={150}
          height={150}
          loading="lazy"
          quality={60}
          placeholder="blur"
          // blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
          blurDataURL={blurDataURL}
          sizes="150px"
          className="rounded-md object-cover"
        />
      ) : (
        <div className="w-[150px] h-[150px] rounded-[50%] bg-gray-200" />
      )}

      <div className="mt-2 text-center">
        <p className="font-semibold text-sm line-clamp-1">{name}</p>
        <p className="text-sm text-gray-500 line-clamp-1">{character}</p>
      </div>
    </div>
  );
}
