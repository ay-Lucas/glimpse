"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

export function VideoPlayer({ youtubeId, id }) {
  const [isVisible, setVisible] = useState(false);
  const [params, setParams] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setParams(searchParams.get("show"));
    if (params === "true") {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
      setVisible(false);
    }
    console.log(params);
  }, [params, searchParams]);

  // const trailer = `https://invidious.selfhost.live/embed/${data.videos.results[0].key}`;
  const trailer = `https://www.youtube-nocookie.com/embed/${youtubeId}?&autoplay=1`;
  // const trailer = `https://piped.syncpundit.io/embed/${data.videos.results[0].key}`;
  // const trailer = `https://piped.selfhost.live/embed/${data.videos.results[0].key}`;
  return (
    <>
      {params && (
        <div
          className={`fixed top-0 w-full h-full flex justify-center bg-background/80 items-center duration-300 will-change-auto ${isVisible ? "opacity-100 z-10 ease-in" : "ease-out transition-opacity opacity-0 z-10"}`}
          // className={`fixed top-0 w-full h-full flex justify-center bg-black/80 items-center duration-300 will-change-auto ease-out transition-opacity fade-in-55 z-10"}`}
        >
          <div className="relative bg-black p-8 rounded-lg">
            <div className="absolute top-1 right-1 ">
              <Link href={`./${id}`}>
                <IoClose size={27} />
              </Link>
            </div>
            <iframe
              width="1428"
              height="802"
              src={trailer}
              allowFullScreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
          {/* <div className="absolute w-full h-full" /> */}
        </div>
      )}
    </>
  );
}
