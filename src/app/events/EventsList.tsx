"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

type EventsListProps = {
  events: CommunityEvent[];
};

const fallbackImage =
  "https://res.cloudinary.com/hy4kyit2a/f_auto%2Cfl_lossy%2Cq_70/learn/modules/trees-to-combat-climate-change/discover-how-salesforce-is-taking-action-with-nature-based-solutions/images/6c2ccbdd638de6fe7c9a9798e0a76bc1_kix.2lj1n3td520.png";

export default function EventsList({ events }: EventsListProps) {
  const [selectedType, setSelectedType] = useState("All");
  const [searchText, setSearchText] = useState("");

  const eventTypes = ["All"];
  events.forEach((event) => {
    if (!eventTypes.includes(event.type)) {
      eventTypes.push(event.type);
    }
  });

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === "All" || event.type === selectedType;
    const eventText =
      `${event.title} ${event.description} ${event.location} ${event.type}`.toLowerCase();
    const matchesSearch = eventText.includes(searchText.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <>
      <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-950/10 bg-card p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <Button
              className={
                selectedType === type
                  ? "h-8 rounded-full bg-emerald-700 px-3 text-[11px] text-white hover:bg-emerald-800"
                  : "h-8 rounded-full px-3 text-[11px]"
              }
              key={type}
              onClick={() => setSelectedType(type)}
              size="sm"
              type="button"
              variant={selectedType === type ? "default" : "outline"}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-[270px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 rounded-full bg-background pl-9 text-xs"
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search event or location"
            type="search"
            value={searchText}
          />
        </div>
      </section>

      <p className="mb-3 text-xs text-muted-foreground">
        {filteredEvents.length} events found
      </p>

      {filteredEvents.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No events match your search. Try another word or category.
        </Card>
      ) : (
        <section
          aria-label="Upcoming events"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredEvents.map((event) => {
            const eventDate = new Date(`${event.date.slice(0, 10)}T00:00:00Z`);
            const imageUrl =
              event.image && !event.image.includes("example.com")
                ? event.image
                : fallbackImage;

            return (
              <Card
                className="overflow-hidden rounded-2xl border-emerald-950/10 bg-card py-0 shadow-sm transition-shadow hover:shadow-md"
                key={event._id}
              >
                <div className="relative h-40 overflow-hidden bg-emerald-50 sm:h-44">
                  <img
                    alt={event.title}
                    className="h-full w-full object-cover"
                    onError={(image) => {
                      image.currentTarget.src = fallbackImage;
                    }}
                    src={imageUrl}
                  />
                  <Badge className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] text-emerald-800 hover:bg-white">
                    {event.type}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays className="size-3.5 text-emerald-700" />
                    {eventDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </div>
                  <h2 className="line-clamp-1 text-base font-semibold leading-6 text-foreground">
                    {event.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-800">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </p>
                  <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
                    {event.description}
                  </p>
                  <CardFooter className="mt-4 justify-end border-t border-border p-0 pt-3">
                    <Link className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-800/20 px-3 text-xs font-medium text-emerald-900 no-underline hover:bg-emerald-50 dark:text-emerald-100 dark:hover:bg-emerald-950/50" href={`/events/${event._id}`}>
                      Details <ArrowRight className="size-3.5" />
                    </Link>
                  </CardFooter>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </>
  );
}
