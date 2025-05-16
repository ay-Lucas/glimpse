import Image from "next/image";
interface CardProps {
  title?: string;
  overview?: string;
  imagePath: string;
  className?: string;
  blurDataURL?: string;
}

export async function Card({
  title,
  overview,
  imagePath,
  className,
  blurDataURL,
}: CardProps) {
  return (
    <div
      className={`${className ?? ""} relative text-xl md:group-hover:scale-110 transform-gpu transition duration-150 rounded-lg overflow-hidden shadow-2xl w-[142.5px] h-[213px] md:w-[190px] md:h-[284px] flex mx-auto z-50 select-none`}
    >
      <div className="absolute z-10 h-full w-full bg-gradient-to-t from-background from-30% to-gray-300/20 opacity-0 md:group-hover:opacity-95 transition-opacity transform-gpu duration-300" />
      <div className="absolute z-20 flex h-full w-full items-end opacity-0 md:group-hover:opacity-100 transition transform-gpu duration-300">
        <div className="p-2">
          <span className="font-bold">{title}</span>
          <div className="text-sm line-clamp-6">{overview}</div>
        </div>
      </div>
      <Image
        width={195}
        height={290}
        src={imagePath}
        alt={`Poster image of ${title}`}
        quality={60}
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes="100px"
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}
