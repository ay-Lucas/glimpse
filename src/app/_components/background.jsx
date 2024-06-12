"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { backgroundImages as images } from "@/lib/constants";
import "@/styles/globals.css";
export default function Background() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      // setIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Switch image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  {
    /* <div className="fixed top-0 left-0 w-full h-full"> */
  }
  return (
    <div className="bg-transition top-0 left-0 w-full h-full z-[-1] object-cover from-background transition-opacity duration-300 ease-in opacity-100 overflow-hidden">
      <Image
        fill
        src={`/${images[index]}`}
        alt={`Background image ${index + 1}`}
        quality={100}
        sizes="100vw"
        style={{
          objectFit: "cover",
          position: "absolute",
        }}
        className="bg-transition"
        // placeholder="blur"
      />
    </div>
  );
}

// import Image from "next/image";
// import psych from "@/../public/psych.jpg";
//
// export function Background() {
//   return (
//     <Image
//       alt="Psych TV series"
//       src={psych}
//       placeholder="blur"
//       quality={100}
//       fill
//       sizes="100vw"
//       style={{
//         objectFit: "cover",
//       }}
//     />
//   );
// }
