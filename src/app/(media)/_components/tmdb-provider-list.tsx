import { BASE_ORIGINAL_IMAGE_URL } from "@/lib/constants";
import { WatchProviderResponse } from "@/types/request-types-camelcase";
import Image from "next/image";

export default function TmdbProviderList({ watchProviders }: { watchProviders: WatchProviderResponse }) {
  const providers = watchProviders.results;
  return (
    <div className="flex flex-wrap gap-2">{
      providers?.US?.flatrate?.map(
        (item, index) => (
          <a
            href={providers?.US?.link}
            key={index}
            className="w-[55px] h-[55px] flex-shrink-0 transform transition-transform  duration-200  hover:scale-105  hover:shadow-xl"
          >
            <Image
              src={`${BASE_ORIGINAL_IMAGE_URL}${item.logoPath}`}
              alt={`${item.providerName} logo`}
              width={55}
              height={55}
              className="rounded-lg object-cover"
            />
          </a>
        ),
      )}
    </div>
  )
}
