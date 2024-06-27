"use client";
import { useState } from "react";
import Image from "next/image";
export function Backdrop({ src }) {
  const [isImageLoading, setImageLoading] = useState(true);
  return (
    <Image
      fill
      src={src}
      quality={75}
      alt="header image"
      priority
      onLoad={() => setImageLoading(false)}
      className={`object-cover -z-10 ${isImageLoading ? "blur-img" : "blur-remove"}`}
      sizes="100vw"
    />
  );
}
