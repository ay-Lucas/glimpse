import { FullTv } from "@/types/camel-index";
import { DetailItem } from "../../_components/media-details";
import { Expandable } from "../../_components/expandable";
import Link from "next/link";
import {
  countryCodeToEnglishName,
  languageCodeToEnglishName,
} from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { InvertibleLogo } from "../../_components/invertible-logo";
import { BASE_MEDIUM_LOGO_URL } from "@/lib/constants";

export function buildTvDetailItems(tv: FullTv): DetailItem[] {
  const items: DetailItem[] = [];

  if (tv.createdBy?.length) {
    items.push({
      label: "Creators",
      value: (
        <Expandable lineHeight={17}>
          {tv.createdBy.map((c, i) => (
            <Link
              key={c.id}
              href={`/person/${c.id}`}
              className="mr-1 text-blue-400 hover:underline"
            >
              {c.name}
              {i < tv.createdBy!.length - 1 ? ", " : ""}
            </Link>
          ))}
        </Expandable>
      ),
    });
  }

  if (tv.popularity != null) {
    items.push({
      label: "Popularity",
      value: Math.round(tv.popularity).toString(),
    });
  }

  if (tv.originalLanguage) {
    items.push({
      label: "Language",
      value: languageCodeToEnglishName(tv.originalLanguage),
    });
  }

  if (tv.originCountry?.length) {
    items.push({
      label: "Origin Country",
      value: tv.originCountry.map(countryCodeToEnglishName).join(", "),
    });
  }

  if (tv.homepage) {
    items.push({
      label: "Homepage",
      value: (
        <a
          href={tv.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
        >
          Official Site
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      ),
    });
  }

  if (tv.runtime) {
    items.push({
      label: "Runtime",
      value: tv.runtime,
    });
  }

  if (tv.spokenLanguages) {
    items.push({
      label: "Spoken Languages",
      value: tv.spokenLanguages
        .map((item) => languageCodeToEnglishName(item.iso6391 ?? ""))
        .join(", "),
    });
  }

  if (tv.productionCountries) {
    items.push({
      label: "Production Countries",
      value: tv.productionCountries
        .map((item) => countryCodeToEnglishName(item.iso31661 ?? ""))
        .join(", "),
    });
  }

  if (tv.productionCompanies?.length) {
    items.push({
      label: "Production Companies",
      value: (
        <div className="flex flex-wrap items-center space-x-4 pt-1">
          {tv.productionCompanies.map((c) => c.name).join(" • ")}
        </div>
      ),
    });
  }

  if (tv.networks?.length) {
    items.push({
      label: "Networks",
      value: (
        <Expandable lineHeight={26}>
          <div className="flex flex-wrap items-center space-x-4 pt-1">
            {tv.networks.map((n, i) => {
              const isLast = i === tv.networks!.length - 1;
              // always wrap in a React node, give it a key:
              return n.logoPath ? (
                <InvertibleLogo
                  key={n.id}
                  src={`${BASE_MEDIUM_LOGO_URL}${n.logoPath}`}
                  height={60}
                  width={60}
                  alt={n.name!}
                />
              ) : (
                <span key={`net-${n.id}`}>
                  {n.name}
                  {!isLast && " • "}
                </span>
              );
            })}
          </div>
        </Expandable>
      ),
    });
  }

  // if (tv.numberOfEpisodes) {
  //   items.push({
  //     label: "Number of Episodes",
  //     value: tv.numberOfEpisodes
  //   })
  // }
  // if (tv.numberOfSeasons) {
  //   items.push({
  //     label: "Number of Seasons",
  //     value: tv.numberOfSeasons
  //   })
  // }
  return items;
}
