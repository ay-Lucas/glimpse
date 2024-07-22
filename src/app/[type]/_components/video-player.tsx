"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VideoPlayer({
  youtubeId,
  id,
}: {
  youtubeId: string;
  id: number;
}) {
  const [isVisible, setVisibility] = useState(false);
  const [params, setParams] = useState<string | null>(null);
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
      router.push(`${id}`);
    }, 200);
    return () => clearTimeout(timeout);
  }
  const trailer = `https://www.youtube-nocookie.com/embed/${youtubeId}?&autoplay=1`;

  return (
    <>
      {params && (
        <div
          onLoad={() => setVisibility(true)}
          className={`opacity-0 z-10 fixed top-0 p-1 md:p-8 xl:px-48 w-screen h-screen flex justify-center bg-background/80 items-center duration-200 transition-opacity ${isVisible ? "ease-in-out opacity-100" : "ease-in-out opacity-0"}`}
        >
          <div className="relative bg-black rounded-lg z-50 lg:w-full xl:h-full w-full h-1/3 md:h-3/5">
            <div className="absolute top-1 right-1 ">
              <Button onClick={exitPlayer} variant="ghost" className="p-2">
                <IoClose size={27} />
              </Button>
            </div>
            <iframe
              className="w-full h-full pt-5"
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
