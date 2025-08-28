"use client";

import { useEffect, useRef, useState } from "react";
import MediaCarousel, { type MediaCarouselProps } from "./media-carousel";
import { Skeleton } from "./ui/skeleton";

function useInView<T extends Element>(
  rootMargin: string = "600px 0px"
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    let cancelled = false;
    const node = ref.current;

    // If IntersectionObserver is unavailable, render immediately.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!cancelled && entry && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [inView, rootMargin]);

  return [ref, inView];
}

export default function LazyMediaCarousel(props: MediaCarouselProps) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="w-full">
      {inView ? (
        <MediaCarousel {...props} />
      ) : (
        <Skeleton className="h-64 w-full rounded-lg" />
      )}
    </div>
  );
}

