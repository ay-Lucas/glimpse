"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { backgroundImages as images } from "@/lib/constants";
export default function Background() {
  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const onLoadCallback = () => {
    setIsReady(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("useEffect loaded");
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Switch image every 10 seconds
    return () => clearInterval(interval);
  }, []);

  {
    /* <div className="fixed top-0 left-0 w-full h-full"> */
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-black from-black transition duration-300 ease-in overflow-hidden">
      <Image
        fill
        src={`/${images[index]}`}
        alt={`Background image ${index + 1}`}
        quality={100}
        sizes="100vw"
        // className="object-cover opacity-70"
        className={`object-cover opacity-70 bg-gray-400 transition duration-1000 ${
          isReady ? "scale-100 bg-gray-400 blur-0" : "scale-120 blur-2xl"
        }`}
        onLoad={onLoadCallback}
        // placeholder="blur"
      />
    </div>
  );
}
