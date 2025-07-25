import { DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import Image from "next/image";
import { SlideCard } from "./slide-card";

export function Card({
  title,
  overview,
  imagePath,
  baseUrl,
  blurDataURL,
  loading = "lazy",
  className = "",
}: {
  title?: string;
  overview?: string;
  imagePath?: string | null;
  baseUrl: string;
  blurDataURL?: string;
  loading?: "lazy" | "eager";
  className?: string;
}) {
  const url = `${baseUrl}${imagePath}`;

  return (
    <div
      className={`group relative transform overflow-hidden rounded-2xl shadow-lg transition-transform duration-200 ease-out will-change-transform group-hover:scale-105 ${className}`}
    >
      <div className="">
        {imagePath && (
          //          <SlideCard
          //            src={url}
          //            alt={title ?? "untitled"}
          //            // quality={100}
          //            className="h-[342px] w-[228px] object-cover"
          //            blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
          //            loading={loading}
          //            aspectClass="aspect-2/3"
          //          />
          <div></div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_35%,transparent)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
      </div>

      <div className="will-change-opacity absolute bottom-0 left-0 right-0 translate-y-4 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_20%,transparent)] p-4 opacity-0 transition-all duration-200 ease-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {overview && (
          <p className="mt-1 line-clamp-5 text-sm text-gray-200">{overview}</p>
        )}
      </div>
    </div>
  );
}

// return (
//   <div
//     className={`group relative transform overflow-hidden rounded-2xl shadow-lg transition-transform duration-200 ease-out will-change-transform group-hover:scale-105 ${className}`}
//   >
//     <div className="group relative h-[342px] w-[228px] transform overflow-hidden rounded-2xl shadow-lg transition-transform duration-200 ease-out will-change-transform group-hover:scale-105">
//       {imagePath && (
//         <SlideCard
//           src={url}
//           alt={title ?? "untitled"}
//           // quality={100}
//           className="h-[342px] w-[228px] object-cover"
//           blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
//           loading={loading}
//           aspectClass="aspect-2/3"
//         />
//       )}
//       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_35%,transparent)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
//     </div>
//
//     <div className="will-change-opacity absolute bottom-0 left-0 right-0 translate-y-4 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_20%,transparent)] p-4 opacity-0 transition-all duration-200 ease-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100">
//       <h3 className="text-xl font-semibold text-white">{title}</h3>
//       {overview && (
//         <p className="mt-1 line-clamp-5 text-sm text-gray-200">{overview}</p>
//       )}
//     </div>
//   </div>
// );
