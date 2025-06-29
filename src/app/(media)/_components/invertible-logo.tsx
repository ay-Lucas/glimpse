"use client"
import Image from 'next/image';
import { Vibrant } from 'node-vibrant/browser';
import { useEffect, useState } from 'react';

function useShouldInvert(src: string) {
  const [invert, setInvert] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Vibrant.from(src)
      .getPalette()
      .then(palette => {
        if (cancelled) return;

        // pick the darkest available swatch
        const swatch =
          palette.DarkMuted ??
          palette.DarkVibrant ??
          palette.Muted ??
          null;

        if (!swatch) {
          setInvert(false);
          return;
        }

        const [h, s, l] = swatch.hsl; // each in [0..1]

        // only invert if it's both very dark AND fairly gray (low saturation)
        const DARKNESS_THRESHOLD = 0.25;   // <25% lightness
        const SATURATION_THRESHOLD = 0.2; // <20% saturation

        setInvert(l < DARKNESS_THRESHOLD && s < SATURATION_THRESHOLD);
      })
      .catch(() => {
        setInvert(false);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return invert;
}

export function InvertibleLogo({ src, alt, width = 92, height = 92 }: { src: string; alt: string, width: number, height: number }) {
  const invert = useShouldInvert(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        filter: invert ? 'invert(1) contrast(1.5)' : undefined,
      }}
      className="object-cover w-auto"
    />
  );
}
