import { DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import Image from "next/image";

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
  const url = `${baseUrl}${imagePath}`

  return (
    <div
      className={`w-[238px] h-[357px] group relative overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform ${className}`}
    >
      <div className="relative w-full h-0 pb-[150%]">
        {imagePath &&
          <Image
            src={url}
            alt={title ?? "untitled"}
            fill
            className="object-cover"
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
            loading={loading}
            sizes="(max-width: 768px) 100vw, 200px"
          />
        }
        <div className="absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_35%,transparent)] pointer-events-none" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-4 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 will-change-opacity will-change-transform bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_20%,transparent)]">
        <h3 className="text-white text-xl font-semibold">{title}</h3>
        {overview && (
          <p className="text-gray-200 text-sm mt-1 line-clamp-5">{overview}</p>
        )}
      </div>
    </div>
  );
}
