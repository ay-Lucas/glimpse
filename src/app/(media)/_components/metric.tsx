import OptionalLink from "./optional-link";

interface MetricProps {
  href?: string;
  Icon: JSX.Element;
  value: React.ReactNode;
  count?: number;
  size?: "small" | "default";
}

export default function Metric({
  href,
  Icon,
  value,
  count,
  size,
}: MetricProps) {
  const fontSize = size === "default" ? "text-lg" : "text-mg";
  const voteCount = count && count > 1000 ? roundHundred(count) : count;
  return (
    <div className="flex items-center space-x-1">
      <OptionalLink href={href}>{Icon}</OptionalLink>
      <span className={fontSize}>{value}</span>
      {count !== undefined && (
        <span className="text-gray-400">({voteCount})</span>
      )}
    </div>
  );
}

function roundHundred(n: number) {
  const roundedHundred = Math.round(n / 100) * 100; // → 4500
  const inK = (roundedHundred / 1000).toFixed(1) + "k"; // → "4.5k"
  return inK;
}
