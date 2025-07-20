import { ReactNode } from "react";
import { DetailsList } from "./details-list";
import { LocalMediaContentRatingModal } from "./media-content-rating";
import { MediaDetails } from "./media-details";

interface MediaStats2Props {
  dateLabel: string;
  dateValue: string | undefined;
  dateLabel2?: string;
  dateValue2?: string;
  isReleased: boolean;
  status?: string;
  runtimeLabel: string | null;
  typeLabel: string;
}

export function MediaStats2({
  dateLabel,
  dateValue,
  dateLabel2,
  dateValue2,
  status,
  runtimeLabel,
  typeLabel,
}: MediaStatsProps) {
  const formattedDate1 = dateValue
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue))
    : null;
  const formattedDate2 = dateValue2
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue2))
    : null;
  return (
    <section className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-5 md:grid-cols-5">
        {dateValue && (
          <div>
            <div className="text-xs font-medium uppercase text-gray-400">
              {dateLabel}
            </div>
            <time className="mt-1 block">{formattedDate1}</time>
          </div>
        )}
        {dateValue2 && dateLabel2 && (
          <div>
            <div className="text-xs font-medium uppercase text-gray-400">
              {dateLabel2}
            </div>
            <time className="mt-1 block">{formattedDate2}</time>
          </div>
        )}
        <div>
          <div className="text-xs font-medium uppercase text-gray-400">
            Status
          </div>
          <div className="mt-1">{status ?? "Unknown"}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-gray-400">
            Age Rating
          </div>
          <LocalMediaContentRatingModal />
        </div>
        {runtimeLabel && (
          <div>
            <div className="text-xs font-medium uppercase text-gray-400">
              Runtime
            </div>
            <div className="mt-1 inline-block border border-gray-300 px-1 text-sm">
              {runtimeLabel}
            </div>
          </div>
        )}
        <div>
          <div className="text-xs font-medium uppercase text-gray-400">
            Type
          </div>
          <div className="mt-1">{typeLabel}</div>
        </div>
      </div>
    </section>
  );
}

// components/MediaStats.tsx
export interface MediaStatsProps {
  dateLabel: string;
  dateValue?: string;
  dateLabel2?: string;
  dateValue2?: string;
  status?: string;
  runtimeLabel?: string;
  typeLabel: "Movie" | "Series" | "Episode";
  isReleased: boolean;
}

export function MediaStats({
  dateLabel,
  dateValue,
  dateLabel2,
  dateValue2,
  status,
  runtimeLabel,
  typeLabel,
  isReleased,
}: MediaStatsProps) {
  const formattedDate1 = dateValue
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue))
    : null;
  const formattedDate2 = dateValue2
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue2))
    : null;
  // describe each cell
  const items: Array<{
    label: string;
    content: React.ReactNode;
    show: boolean;
  }> = [
    {
      label: dateLabel,
      content: <time dateTime={dateValue}>{formattedDate1}</time>,
      show: Boolean(dateValue),
    },
    {
      label: dateLabel2 ?? "",
      content: <time dateTime={dateValue2}>{formattedDate2}</time>,
      show: Boolean(dateLabel2 && dateValue2),
    },
    {
      label: "Status",
      content: status || "Unknown",
      show: true,
    },
    {
      label: "Age Rating",
      content: <LocalMediaContentRatingModal />,
      show: typeLabel !== "Episode",
    },
    {
      label: "Runtime",
      content: (
        <span className="inline-block border border-gray-300 px-1 text-sm">
          {runtimeLabel}
        </span>
      ),
      show: Boolean(runtimeLabel),
    },
    {
      label: "Type",
      content: typeLabel,
      show: true,
    },
  ];

  return (
    <section className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-5 md:grid-cols-5">
        {items
          .filter((i) => i.show)
          .map(({ label, content }) => (
            <StatsItem key={label} label={label}>
              {content}
            </StatsItem>
          ))}
      </div>
    </section>
  );
}

export interface StatsItemProps {
  label: string;
  children: ReactNode;
}
export function StatsItem({ label, children }: StatsItemProps) {
  return (
    <div>
      <div className="text-xs font-medium uppercase text-gray-400">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
