"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VideoPlayer({ youtubeId, id }) {
  const [isVisible, setVisibility] = useState(false);
  const [params, setParams] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setParams(searchParams.get("show"));
    if (params === "true") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [params, searchParams]);

  function exitPlayer() {
    setVisibility(false);
    const timeout = setTimeout(() => {
      router.replace(`${id}`);
    }, 200);
    return () => clearTimeout(timeout);
  }

  // const trailer = `https://invidious.selfhost.live/embed/${data.videos.results[0].key}`;
  const trailer = `https://www.youtube-nocookie.com/embed/${youtubeId}?&autoplay=1`;
  // const trailer = `https://piped.syncpundit.io/embed/${data.videos.results[0].key}`;
  // const trailer = `https://piped.selfhost.live/embed/${data.videos.results[0].key}`;
  return (
    <>
      {params && (
        <div
          onLoad={() => setVisibility(true)}
          className={`opacity-0 z-10 fixed top-0 w-full h-full flex justify-center bg-background/80 items-center duration-200 transition-opacity ${isVisible ? "ease-in-out opacity-100" : "ease-in-out opacity-0"}`}
        >
          {/* <div className="relative bg-black p-8 rounded-lg z-50 lg:w-[1428px] lg:h-[803px] md:w-[714px] md:h-[401.5px]"> */}
          <div className="relative bg-black p-8 rounded-lg z-50">
            <div className="absolute top-1 right-1 ">
              <Button onClick={exitPlayer} variant="ghost" className="p-2">
                <IoClose size={27} />
              </Button>
            </div>
            <iframe
              className="lg:w-[1428px] lg:h-[803px] md:w-[714px] md:h-[401.5px] w-[357px] h-[200.75px]"
              // width="1428"
              // height="803"
              // className="w-auto h-auto"
              src={trailer}
              allowFullScreen
              allowTransparency
            ></iframe>
          </div>
          <Link
            href={`./${id}`}
            className="absolute top-0 left-0 w-full h-full z-10 cursor-default"
          />
        </div>
      )}
    </>
  );
}
