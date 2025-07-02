"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VideoPlayer({
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
          className={`fixed top-0 z-10 flex h-screen w-screen items-center justify-center bg-background/80 p-1 opacity-0 transition-opacity duration-200 md:p-8 xl:px-48 ${isVisible ? "opacity-100 ease-in-out" : "opacity-0 ease-in-out"}`}
        >
          <div className="relative z-50 h-1/3 w-full rounded-lg bg-black md:h-3/5 lg:w-full xl:h-full">
            <div className="absolute right-1 top-1">
              <Button onClick={exitPlayer} variant="ghost" className="p-2">
                <IoClose size={27} />
              </Button>
            </div>
            <iframe
              className="h-full w-full pt-5"
              src={trailer}
              allowFullScreen
            ></iframe>
          </div>
          <Link
            href={`./${id}`}
            className="absolute left-0 top-0 z-10 h-full w-full cursor-default"
          />
        </div>
      )}
    </>
  );
}
