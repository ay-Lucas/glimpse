import { Badge } from "@/components/ui/badge";
import AdultFlag from "./adult-flag";
import { Genre } from "@/types/types";

interface MediaTitleProps {
  title: string;
  tagline?: string | null;
  genres?: Genre[] | null;
  isAdult: boolean;
}

export function MediaTitle({
  title,
  tagline,
  genres,
  isAdult,
}: MediaTitleProps) {
  return (
    <div className="space-y-2.5">
      <div>
        <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
        {tagline && <p className="pt-1 italic text-gray-300">“{tagline}”</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isAdult && (
          <Badge variant="destructive">
            <AdultFlag isAdult={isAdult} />
          </Badge>
        )}
        {genres?.map((g) => (
          <Badge
            key={g.id}
            variant="default"
            className="rounded-lg bg-primary-foreground px-2 py-0.5 text-sm text-white ring-1 ring-gray-800 transition hover:bg-gray-700"
          >
            {g.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
