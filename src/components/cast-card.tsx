"use client";

import Image from "next/image";
import { useState } from "react";
interface CardProps {
  name?: string;
  character?: string;
  imagePath?: string;
  index: number;
  loading?: "lazy" | "eager";
  className?: string;
}

export function CastCard({
  name,
  character,
  imagePath,
  index,
  loading,
  className,
}: CardProps) {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <div
      className={`${className ?? ""} text-xl md:group-hover:scale-110 transform-gpu transition duration-150 overflow-hidden shadow-2xl h-full mx-auto z-50 select-none rounded-lg justify-center w-fit`}
    >
      <Image
        width={150}
        height={150}
        // fill
        src={`https://image.tmdb.org/t/p/original/${imagePath}`}
        alt={`Background image ${index + 1}`}
        key={index}
        quality={75}
        // sizes="(max-width: 300px), 40vw, (max-width: 768px) 33vw, (max-width: 1080px) 23vw, (max-width: 1200px) 20vw"
        onLoad={() => setImageLoading(false)}
        // className={`object-cover transition ${isImageLoading ? "blur-img" : "remove-blur"}`}
        className={`object-cover transition ${isImageLoading ? "blur-img" : "remove-blur"} w-[150px] h-[150px] rounded-[50%] mx-auto`}
        loading={loading}
      />
      {/* </div> */}
      <div className="flex flex-col items-center text-center pt-1">
        <div className="font-bold text-md md:text-lg">{name}</div>
        <div className="text-sm">{character}</div>
      </div>
    </div>
  );
}
