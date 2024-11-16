"use client";
import { useState } from "react";
import Image from "next/image";
export function Poster({
  src,
  blurDataUrl,
}: {
  src: string;
  blurDataUrl: string;
}) {
  return (
    <Image
      quality={100}
      width={190}
      height={284}
      src={src}
      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 80vw"
      className={`object-cover rounded-xl mx-auto w-[190px] h-[284px]`}
      priority
      placeholder="blur"
      blurDataURL={blurDataUrl}
      loading="eager"
      alt="poster image"
    />
  );
}
