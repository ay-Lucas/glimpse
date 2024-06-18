import Image from "next/image";

export function Card({ data, index }) {
  return (
    <div className="relative text-xl overflow-hidden group">
      <div className="absolute h-full w-full bg-gradient-to-t from-gray-900 to-gray-600/40 transform-gpu opacity-0 group-hover:opacity-95 transition duration-200 rounded-xl" />
      <div className="absolute flex h-full w-full items-end transform-gpu opacity-0 group-hover:opacity-100 transition duration-200">
        <div className="p-2">
          <span className="font-bold">{data.name || data.title}</span>
          <div className="text-sm line-clamp-6">{data.overview}</div>
        </div>
      </div>
      <Image
        width={220}
        height={330}
        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
        alt={`Background image ${index + 1}`}
        key={index}
        quality={50}
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`transition duration-200 rounded-xl`}
      />
    </div>
  );
}
