import Image from "next/image";

export function Card({ data, index }) {
  return (
    <div className="relative text-xl group-hover:scale-110 transform-gpu transition duration-150 rounded-xl overflow-hidden shadow-2xl w-[220px] h-[330px]">
      <div className="absolute z-10 h-full w-full bg-gradient-to-t from-background from-30% to-gray-300/20 opacity-0 group-hover:opacity-95 transition-opacity transform-gpu duration-300" />
      <div className="absolute z-20 flex h-full w-full items-end opacity-0 group-hover:opacity-100 transition transform-gpu duration-300">
        <div className="p-2">
          <span className="font-bold">{data.name || data.title}</span>
          <div className="text-sm line-clamp-6">{data.overview}</div>
        </div>
      </div>
      <Image
        // width={220}
        // height={330}
        fill
        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
        alt={`Background image ${index + 1}`}
        key={index}
        quality={100}
        sizes="(max-width: 300px) 10vw, 20vw"
        className={`rounded-xl border-2 dark:border-gray-950 object-cover`}
        priority
      />
    </div>
  );
}
