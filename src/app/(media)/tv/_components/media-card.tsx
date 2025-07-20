import { DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export interface MediaCardMeta {
  label?: string;
  value: React.ReactNode;
}

interface MediaCardProps {
  href: string;
  imageSrc?: string;
  imageType: "poster" | "still";
  imageAlt: string;
  title: React.ReactNode;
  airDate?: string;
  meta: MediaCardMeta[];
  children?: React.ReactNode;
}

export function MediaCard({
  href,
  imageSrc,
  imageType,
  imageAlt,
  title,
  airDate,
  meta,
  children,
}: MediaCardProps) {
  const isPoster = imageType === "poster";
  const imgWidth = isPoster ? 125 : 250;
  const imgAspect = isPoster ? "aspect-[2/3]" : "aspect-[16/9]";
  const colSpan = isPoster
    ? "xxs:col-span-1 sm:col-start-2"
    : "xxs:col-span-2 col-start-1";
  const gridCols = isPoster
    ? `xxs:grid-cols-[125px_1fr] `
    : `xxs:grid-cols-[250px_1fr]`;
  const formattedDate = airDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
        year: "numeric",
      }).format(new Date(airDate))
    : "TBD";
  console.log(imageSrc);
  return (
    <section
      className={`media-card grid grid-cols-1 gap-2 ${gridCols} sm:gap-4`}
    >
      {imageSrc ? (
        <Link
          href={href}
          className={`row-span-2 flex-shrink-0 rounded-lg`}
          style={{ width: imgWidth }}
        >
          <figure className={`${imgAspect} relative w-full`}>
            <Image
              fill
              quality={90}
              src={imageSrc}
              alt={imageAlt}
              className="rounded-lg object-cover"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          </figure>
        </Link>
      ) : (
        <div style={{ width: imgWidth }} />
      )}
      <div className="flex items-start gap-4">
        <div className="flex w-full flex-col space-y-2">
          <div className="flex flex-col items-start justify-between xs:flex-row">
            <Link
              href={href}
              className="flex w-full items-center hover:text-gray-400"
            >
              <h2 className="flex w-full flex-col text-xl font-bold">
                {title}
              </h2>
              {/* <ChevronRight className="ml-1" /> */}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {meta.map(({ label, value }) => (
              <div key={label} className="space-y-1">
                {label && (
                  <div className="text-xs font-medium uppercase text-gray-500">
                    {label}
                  </div>
                )}
                <div className="text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {children && <div className={`mt-2 flex ${colSpan}`}>{children}</div>}
    </section>
  );
}
