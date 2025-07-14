import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function AdultFlag({ isAdult }: { isAdult: boolean }) {
  return (
    <div className="flex items-center space-x-1">
      <span className="font-medium">{isAdult ? "Adult" : "General"}</span>
      {isAdult && (
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 cursor-pointer text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            Indicates mature content: may include nudity, strong language, or
            graphic violence.
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
