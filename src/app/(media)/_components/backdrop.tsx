import Image from "next/image";
export function Backdrop({
  src,
  blurDataUrl,
}: {
  src: string;
  blurDataUrl: string;
}) {
  return (
    <Image
      fill
      src={src}
      quality={70}
      alt="header image"
      className={`object-cover -z-10`}
      sizes="100vw"
      placeholder="blur"
      blurDataURL={blurDataUrl}
    />
  );
}
