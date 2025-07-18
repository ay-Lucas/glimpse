"use client";

import { SlideCard } from "@/components/slide-card";
import {
  MovieResult,
  PersonResult,
  TvResult,
} from "@/types/request-types-camelcase";
import { useState, useEffect } from "react";

type Item = any;

export function InfiniteSearchList({
  query,
  mediaType,
  includeAdult,
  genreIds,
}: {
  query: string;
  mediaType: string;
  includeAdult: boolean;
  genreIds: number[] | null;
}) {
  const [results, setResults] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query, mediaType, includeAdult, genreIds]);

  // Fetch whenever page (or query) changes
  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);

    const params = new URLSearchParams({
      query,
      mediaType,
      includeAdult: String(includeAdult),
      page: String(page),
    });

    if (genreIds && genreIds.length > 0)
      params.set("genreIds", genreIds.join(","));

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { results: Item[] }) => {
        setResults((prev) => [...prev, ...data.results]);
        // stop if API returns no more items
        if (!data.results.length) setHasMore(false);
      })
      .finally(() => setLoading(false));
    console.log("page: " + page + "\n" + "results: \n");
    console.log(JSON.stringify(results));
  }, [query, mediaType, includeAdult, page, hasMore]);

  // scroll listener to load next page when near bottom
  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore) return;
      // how close to the bottom before loading
      const threshold = 300;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold;
      if (scrolledToBottom) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading, hasMore]);

  return (
    <div className="grid grid-cols-2 gap-2 xxs:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-5 xl:grid-cols-6">
      {results.map((item, idx) => {
        const title =
          (item as TvResult).name ||
          (item as MovieResult).title ||
          (item as PersonResult).name;
        const imagePath =
          item.mediaType !== "person" ? item.posterPath : item.profilePath;
        const overview =
          item?.mediaType !== "person" ? item?.overview : undefined;
        const tmdbVoteAverage =
          item?.mediaType !== "person" ? item?.voteAverage : undefined;
        const tmdbVoteCount =
          item?.mediaType !== "person" ? item?.voteCount : undefined;
        if (!imagePath) return <div></div>;
        return (
          <SlideCard
            key={item?.id!}
            alt={`poster of ${title}`}
            aspectClass="aspect-[2/3]"
            tmdbId={item?.id!}
            mediaType={item.mediaType!}
            baseUrl="/tmdb/t/p/w500"
            imagePath={imagePath}
            title={title}
            unoptimized
            overview={overview}
            tmdbVoteAverage={tmdbVoteAverage}
            tmdbVoteCount={tmdbVoteCount}
            isAdult={item.adult}
            enableSafeImage={false}
          />
        );
      })}

      {loading && (
        <div className="py-2 text-center text-sm text-gray-500">Loading…</div>
      )}

      {!hasMore && (
        <div className="py-2 text-center text-sm text-gray-400">
          No more results
        </div>
      )}
    </div>
  );
}
