// components/FlagIcon.tsx
"use client";

import * as Flags from "country-flag-icons/react/3x2";
import { ComponentType, SVGProps } from "react";

type FlagIconProps = {
  /** 2-letter country code, e.g. "us", "GB", "jp" */
  code: string;
  /** any extra SVG props (className, aria-labels, etc) */
} & SVGProps<SVGSVGElement>;

export function FlagIcon({ code, ...svgProps }: FlagIconProps) {
  // Normalize to upper-case alpha-2
  const key = code.trim().toUpperCase();
  // Look up the component by name. e.g. "US", "GB", "JP"
  const FlagComponent = (
    Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>
  )[key];

  if (!FlagComponent) {
    console.warn(`⚠️ no flag icon for country code "${code}"`);
    return null;
  }

  return <FlagComponent {...svgProps} />;
}
