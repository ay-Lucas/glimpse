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
      quality={60}
      width={190}
      height={285}
      src={src}
      className={`object-cover rounded-xl mx-auto w-[190px] h-[285px]`}
      priority
      placeholder="blur"
      blurDataURL={blurDataUrl}
      loading="eager"
      alt="poster image"
    />
  );
}
