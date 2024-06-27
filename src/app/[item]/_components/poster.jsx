"use client";
import { useState } from "react";
import Image from "next/image";
export function Poster({ src }) {
  const [isImageLoading, setImageLoading] = useState(true);
  return (
    <Image
      quality={75}
      width={190}
      height={284}
      src={src}
      sizes="(max-width: 190px) 5vw, 10vw"
      onLoad={() => setImageLoading(false)}
      className={`object-cover rounded-xl mx-auto md:m-0 p-5 md:p-0 ${isImageLoading ? "blur-img" : "remove-blur"}`}
      priority
      alt="poster image"
    />
  );
}
