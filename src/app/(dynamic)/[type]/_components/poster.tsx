"use client";
import { useState } from "react";
import Image from "next/image";
export function Poster({ src }: { src: string }) {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <Image
      quality={100}
      width={190}
      height={284}
      src={src}
      sizes="(max-width: 768px) 40vw, (max-width: 1200px) 80vw"
      onLoad={() => setImageLoading(false)}
      className={`object-cover rounded-xl mx-auto mb-4 md:m-0 ${isImageLoading ? "blur-img" : "remove-blur"}`}
      priority
      loading="eager"
      alt="poster image"
    />
  );
}
