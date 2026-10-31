import Navbar from "@/components/Navbar";
import Link from "next/link";
import EventsList from "./EventsList";
import { Badge } from "@/components/ui/badge";

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

async function getEvents() {
  try {
    const response = await fetch("http://localhost:5000/api/events", {
      cache: "no-store",
    });
    const result: { data: CommunityEvent[] } = await response.json();

    if (response.ok) {
      return result.data;
    }
  } catch {
    return [];
  }

  return [];
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
      <Navbar />
      <main className="min-h-[calc(100vh-86px)] px-4 py-7 sm:px-6 sm:py-9">
        <div className="mx-auto w-full max-w-[1160px]">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <Badge className="mb-2 rounded-full bg-emerald-50 text-[9px] font-semibold tracking-wide text-emerald-800 hover:bg-emerald-50">
              GOODNEIGHBOR · LOCAL ACTION
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl">
              Upcoming Events
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Small ways to make a difference, right in your neighbourhood.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {events.length} events listed
            </span>
            <Link className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white no-underline hover:bg-emerald-800" href="/create-event">
              Create event
            </Link>
          </div>
        </header>

        {events.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No upcoming events right now. Please check again soon.
          </p>
        ) : (
          <EventsList events={events} />
        )}
        </div>
      </main>
    </div>
  );
}
