"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Background({ images }: { images: Array<String> }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Switch image every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full duration-300 ease-in overflow-hidden bg-gradient-to-t bg-blend-overlay from-gray-200 to-gray-950">
      <div className="absolute top-0 left-0 w-full h-full opacity-50">
        {images.map((url, i) => (
          <Image
            fill
            src={`${url}`}
            alt={`Background image ${i + 1}`}
            key={i}
            quality={100}
            sizes="100vw"
            className={`object-cover transition from-background duration-1000 ${i === index ? "bg-gray-400 blur-0 opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </div>
  );
}
