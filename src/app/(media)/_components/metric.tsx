import OptionalLink from "./optional-link";

interface MetricProps {
  href?: string;
  Icon: JSX.Element;
  value: React.ReactNode;
  count?: number;
}

export default function Metric({ href, Icon, value, count }: MetricProps) {
  return (
    <div className="flex items-center space-x-1">
      <OptionalLink href={href}>{Icon}</OptionalLink>
      <span className="text-lg">{value}</span>
      {count !== undefined && <span className="text-gray-400">({count})</span>}
    </div>
  );
}


