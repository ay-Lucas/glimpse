"use client";
import Image from "next/image";
export function Poster({
  src,
  blurDataUrl,
}: {
  src: string;
  blurDataUrl: string;
}) {
  return (
    <Image
      quality={75}
      width={190}
      height={285}
      src={src}
      sizes="(max-width: 460px) 50vw, (max-width: 768px) 30vw, (max-width: 1200px) 20vw, 10vw"
      className={`object-cover rounded-xl mx-auto w-[190px] h-[285px]`}
      priority
      placeholder="blur"
      blurDataURL={blurDataUrl}
      loading="eager"
      alt="poster image"
    />
  );
}
