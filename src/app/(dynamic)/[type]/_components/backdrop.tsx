"use client";
import { useState } from "react";
import Image from "next/image";
export function Backdrop({
  src,
  blurDataUrl,
}: {
  src: string;
  blurDataUrl: string;
}) {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <Image
      fill
      src={src}
      quality={100}
      alt="header image"
      priority
      onLoad={() => setImageLoading(false)}
      // className={`object-cover -z-10 ${isImageLoading ? "blur-img" : "blur-remove"}`}
      className={`object-cover -z-10 fade-in-65 transition`}
      sizes="100vw"
      placeholder="blur"
      blurDataURL={blurDataUrl}
    />
  );
}
