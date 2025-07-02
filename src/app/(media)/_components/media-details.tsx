import { Fragment, ReactNode } from "react";

export type DetailItem = {
  label: string;
  value?: string | ReactNode | null;
};

export function MediaDetails({ items }: { items: DetailItem[] }) {
  return (
    <div className="media-card">
      <h2 className="pb-4 text-2xl font-bold">Details</h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {items.map(({ label, value }) => (
          <Fragment key={label}>
            <div>
              <dt className="font-medium text-gray-400">{label}</dt>
              <dd className="">{value}</dd>
            </div>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
