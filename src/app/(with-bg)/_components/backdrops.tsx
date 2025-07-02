"use client";
import { BASE_ORIGINAL_IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Backdrops({
  images,
  firstBackdropBlurData,
}: {
  images: Array<String>;
  firstBackdropBlurData: string;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Switch image every 10 seconds
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden bg-gradient-to-t from-gray-200 to-gray-950 bg-blend-overlay duration-300 ease-in">
      <div className="absolute left-0 top-0 h-full w-full opacity-50">
        {images.map((backdropPath, i) => (
          <Image
            fill
            src={`${BASE_ORIGINAL_IMAGE_URL}${backdropPath}`}
            alt={`Background image ${i + 1}`}
            key={i}
            quality={75}
            sizes="100vw"
            className={`from-background object-cover transition duration-1000 ${i === index ? "bg-gray-400 opacity-100 blur-0" : "opacity-0"}`}
            placeholder="blur"
            blurDataURL={firstBackdropBlurData}
          />
        ))}
      </div>
    </div>
  );
}
