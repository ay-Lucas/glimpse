"use client";

import { Expandable } from "./expandable";

interface MediaOverviewProps {
  overview: string;
}

export function MediaOverview({ overview }: MediaOverviewProps) {
  return (
    <div>
      <div className="text-xs font-medium uppercase text-gray-400">
        Overview
      </div>
      <Expandable buttonClassname="mt-1 md:text-md">{overview}</Expandable>
    </div>
  );
}
