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
      className={`${className ?? ""} relative text-xl md:group-hover:scale-110 transform-gpu transition duration-150 overflow-hidden shadow-2xl md:w-[190px] md:h-[284px] flex mx-auto z-50 select-none rounded-lg justify-center`}
    >
      {/* <div className="absolute z-10 w-full h-full items-start"> */}
      <Image
        width={175}
        height={175}
        // fill
        src={`https://image.tmdb.org/t/p/original/${imagePath}`}
        alt={`Background image ${index + 1}`}
        key={index}
        quality={75}
        // sizes="(max-width: 300px), 40vw, (max-width: 768px) 33vw, (max-width: 1080px) 23vw, (max-width: 1200px) 20vw"
        onLoad={() => setImageLoading(false)}
        // className={`object-cover transition ${isImageLoading ? "blur-img" : "remove-blur"}`}
        className={`object-cover transition ${isImageLoading ? "blur-img" : "remove-blur"} w-[175px] h-[175px] rounded-[50%]`}
        loading={loading}
      />
      {/* </div> */}
      <div className="absolute z-20 flex h-full w-full items-end transition transform-gpu duration-300 rounded-xl ">
        <div className="p-2">
          <span className="font-bold">{name}</span>
          <div className="text-sm line-clamp-6">{character}</div>
        </div>
      </div>
    </div>
  );
}
