import Link from "next/link"
import { DetailItem } from "../../_components/media-details"
import { ExpandableText } from "../../_components/expandable-overview"
import { FullMovie } from "@/types/camel-index"
import { countryCodeToEnglishName, languageCodeToEnglishName } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

export function buildMovieDetailItems(movie: FullMovie): DetailItem[] {
  const items: DetailItem[] = []

  // 1) Directors
  const directors = movie.credits?.crew?.filter(c => c.job === "Director")
  if (directors && directors.length > 0) {
    const directorTags = directors.map((d, i) => (
      <Link
        key={d.id}
        href={`/person/${d.id}`}
        className="text-blue-200 hover:underline"
      >
        {d.name}
        {i < directors.length - 1 ? ", " : ""}
      </Link>
    ))
    items.push({
      label: "Directors",
      value: <ExpandableText lineHeight={17}>{directorTags}</ExpandableText>,
    })
  }

  // 2) Producers
  const producers = movie.credits?.crew?.filter(c => c.job === "Producer")
  if (producers && producers.length > 0) {
    const producerTags = producers.map((p, i) => (
      <Link
        key={p.id}
        href={`/person/${p.id}`}
        className="text-blue-200 hover:underline"
      >
        {p.name}
        {i < producers.length - 1 ? ", " : ""}
      </Link>
    ))
    items.push({
      label: "Producers",
      value: <ExpandableText lineHeight={17}>{producerTags}</ExpandableText>,
    })
  }

  // 3) Writers
  const writers = movie.credits?.crew?.filter(c => c.job === "Writer")
  if (writers && writers.length > 0) {
    const writerTags = writers.map((w, i) => (
      <Link
        key={w.id}
        href={`/person/${w.id}`}
        className="text-blue-200 hover:underline"
      >
        {w.name}
        {i < writers.length - 1 ? ", " : ""}
      </Link>
    ))
    items.push({
      label: "Writers",
      value: <ExpandableText lineHeight={17}>{writerTags}</ExpandableText>,
    })
  }

  // 4) Revenue & Budget
  if (movie.revenue && movie.revenue > 0) {
    items.push({
      label: "Revenue",
      value: `$${movie.revenue.toLocaleString()}`,
    })
  }
  if (movie.budget && movie.budget > 0) {
    items.push({
      label: "Budget",
      value: `$${movie.budget.toLocaleString()}`,
    })
  }

  // 5) Vote average & count
  if (movie.voteAverage != null) {
    items.push({
      label: "Vote Average",
      value: movie.voteAverage.toFixed(1),
    })
  }
  if (movie.voteCount != null && movie.voteCount > 0) {
    items.push({
      label: "Vote Count",
      value: movie.voteCount.toString(),
    })
  }

  // 6) Popularity
  if (movie.popularity != null && movie.popularity > 0) {
    items.push({
      label: "Popularity",
      value: Math.round(movie.popularity).toString(),
    })
  }

  // 7) Language
  if (movie.originalLanguage) {
    items.push({
      label: "Language",
      value: languageCodeToEnglishName(movie.originalLanguage),
    })
  }

  // 8) Origin country
  if (movie.originCountry && movie.originCountry.length > 0) {
    items.push({
      label: "Origin Country",
      value: movie.originCountry
        .map(countryCodeToEnglishName)
        .filter(Boolean)
        .join(", "),
    })
  }
  if (movie.homepage) {
    items.push({
      label: "Homepage",
      value: <a
        href={movie.homepage}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
      >
        Official Site
        <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    })
  }

  if (movie.spokenLanguages) {
    items.push({
      label: "Spoken Languages",
      value: movie.spokenLanguages.map(item => languageCodeToEnglishName(item.iso6391 ?? ""))
    })
  }

  if (movie.productionCountries) {
    items.push({
      label: "Production Countries",
      value: movie.productionCountries.map(item => countryCodeToEnglishName(item.iso31661 ?? "")).join(", ")
    })
  }

  if (movie.productionCompanies?.length) {
    items.push({
      label: 'Production Companies',
      value: (
        <div className="flex flex-wrap items-center space-x-4 pt-1">
          {movie.productionCompanies.map(c => c.name).join((' • '))}
        </div>
      )
    })
  }

  return items
}
