import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { getPersonRank } from "../utils";
import { getRedisPopularPeopleScores } from "@/services/cache";

interface PersonRankProps {
  popularity: number;
  name: string;
}

export default async function PersonRank({
  popularity,
  name,
}: PersonRankProps) {
  const scores = await getRedisPopularPeopleScores();
  if (!scores?.sortedScores) return;
  const rank = getPersonRank(popularity, scores.sortedScores, true);
  const total = scores.sortedScores.length;

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-lg font-bold text-gray-400">
            <HiQuestionMarkCircle size={17} />
            <p className="pr-2">Rank</p>
            <p className="text-white">
              {rank && rank <= (total ?? 0)
                ? `#${rank} of ${total}`
                : `> ${total}`}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {rank
            ? `Out of the ${total} most popular actors, ${name} ranks ${rank}`
            : `${name} does not rank within the top ${total}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
