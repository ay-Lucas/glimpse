"use client";
import Image from "next/image";
import React from "react";
export function Card({ data, index, variant }) {
  const [isImageLoading, setImageLoading] = React.useState(true);

  return (
    <div className="relative text-xl group-hover:scale-110 transform-gpu transition duration-150 rounded-xl overflow-hidden shadow-2xl w-[142.5px] h-[213px] md:w-[190px] md:h-[284px]">
      <div className="absolute z-10 h-full w-full bg-gradient-to-t from-background from-30% to-gray-300/20 opacity-0 group-hover:opacity-95 transition-opacity transform-gpu duration-300" />
      <div className="absolute z-20 flex h-full w-full items-end opacity-0 group-hover:opacity-100 transition transform-gpu duration-300">
        <div className="p-2">
          <span className="font-bold">{data.name || data.title}</span>
          <div className="text-sm line-clamp-6">{data.overview}</div>
        </div>
      </div>

      {/* {variant === "numbered" ? ( */}
      {/*   <div className="text-4xl text-gray-300  z-10 absolute font-extrabold bg-blend-difference"> */}
      {/*     {index + 1} */}
      {/*   </div> */}
      {/* ) : ( */}
      {/*   "" */}
      {/* )} */}
      {variant === "labeled" ? (
        <div
          className={`border border-gray-300/50 w-14 h-6 top-1 left-1 shadow-xl text-sm font-semibold text-center rounded-2xl z-10 absolute bg-blend-difference ${data.media_type === "tv" ? "bg-blue-500/85" : "bg-green-500/85"}`}
        >
          <span className="align-middle">{data.media_type}</span>
        </div>
      ) : (
        ""
      )}

      <Image
        // width={190}
        // height={284}
        fill
        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
        alt={`Background image ${index + 1}`}
        key={index}
        quality={75}
        sizes="(max-width: 768px) 33vw, (max-width: 1080px) 23vw, (max-width: 1200px) 15vw"
        onLoad={() => setImageLoading(false)}
        className={`object-cover transition ${isImageLoading ? "blur-img" : "remove-blur"}`}
        priority
      />
    </div>
  );
}
