"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { backgroundImages as images } from "@/lib/constants";
export function Background() {
  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const onLoadCallback = () => {
    setIsReady(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Switch image every 10 seconds
    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] duration-300 ease-in overflow-hidden">
      {images.map((url, i) => (
        <Image
          fill
          src={`/${url}`}
          alt={`Background image ${i + 1}`}
          key={i}
          quality={100}
          sizes="100vw"
          className={`object-cover transition from-background duration-1000 ${i === index ? "bg-gray-400 blur-0 opacity-100" : "opacity-0"}`}
          // ${isReady ? "duration-100 scale-100 bg-gray-400 blur-0" : "scale-120 blur-md"}`}
          onLoad={onLoadCallback}
        />
      ))}
    </div>
  );
}
