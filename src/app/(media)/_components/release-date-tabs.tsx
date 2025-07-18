"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FlagIcon } from "./flag-icon";
import { countryCodeToEnglishName } from "@/lib/utils";
import { Expandable } from "./expandable";

interface ReleaseDateItem {
  iso31661: string;
  certification: string;
}

interface DateGroup {
  date: string;
  formatted: string;
  items: ReleaseDateItem[];
}

interface GroupedRelease {
  type: number;
  label: string;
  dates: DateGroup[];
}

export function MovieReleasesTabs({ grouped }: { grouped: GroupedRelease[] }) {
  return (
    <Tabs defaultValue={String(grouped[0]?.type)}>
      <TabsList>
        {grouped.map(({ type, label }) => (
          <TabsTrigger key={type} value={String(type)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {grouped.map(({ type, dates }) => (
        <TabsContent key={type} value={String(type)}>
          <Accordion type="multiple" defaultValue={dates.map((d) => d.date)}>
            {dates.map((group) => (
              <>
                {group.items.length > 9 ? (
                  <Expandable lineHeight={50}>
                    <ReleaseDatePanel key={group.date} group={group} />
                  </Expandable>
                ) : (
                  <ReleaseDatePanel key={group.date} group={group} />
                )}
              </>
            ))}
          </Accordion>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ReleaseDatePanel({ group }: { group: DateGroup }) {
  const { date, formatted, items } = group;

  return (
    <AccordionItem value={date}>
      <AccordionTrigger>{formatted}</AccordionTrigger>
      <AccordionContent className="space-y-2">
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map(({ iso31661, certification }) => {
            const countryName = countryCodeToEnglishName(iso31661);
            return (
              <div
                key={`${iso31661}-${certification}`}
                className="flex items-center space-x-2"
              >
                <FlagIcon code={iso31661} className="h-6 w-9" />
                <span className="flex-1">{countryName}</span>
                {certification && <Badge>{certification}</Badge>}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
