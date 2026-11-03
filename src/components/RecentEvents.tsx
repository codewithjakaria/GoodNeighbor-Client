import Link from "next/link";
import { API_URL } from "@/lib/config";

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

const fallbackImage =
  "https://res.cloudinary.com/hy4kyit2a/f_auto%2Cfl_lossy%2Cq_70/learn/modules/trees-to-combat-climate-change/discover-how-salesforce-is-taking-action-with-nature-based-solutions/images/6c2ccbdd638de6fe7c9a9798e0a76bc1_kix.2lj1n3td520.png";

async function getRecentEvents(): Promise<CommunityEvent[]> {
  const url = `${API_URL}/api/events?limit=6`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[RecentEvents] GET ${url} failed with status ${response.status}`,
      );
      return [];
    }

    const result: { data: CommunityEvent[] } = await response.json();

    if (!Array.isArray(result.data)) {
      console.error(`[RecentEvents] GET ${url} returned an unexpected payload`);
      return [];
    }

    return result.data;
  } catch (error) {
    console.error(`[RecentEvents] GET ${url} failed:`, error);
    // Show the empty state when the server is not reachable.
    return [];
  }
}

export default async function RecentEvents() {
  const events = await getRecentEvents();

  return (
    <section className="bg-[var(--nav-background)] px-4 pb-14 sm:px-6" aria-labelledby="recent-events-title">
      <div className="mx-auto w-full max-w-[1160px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="latest-event-eyebrow">Fresh from your neighbours</span>
            <h2
              className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl"
              id="recent-events-title"
            >
              Recent Events
            </h2>
          </div>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-800/20 px-4 text-xs font-semibold text-emerald-900 no-underline hover:bg-white/70 dark:text-emerald-100"
            href="/events"
          >
            See all events
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
            No events just yet — check back soon, or be the first to bring your
            neighbours together.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const eventDate = new Date(`${event.date.slice(0, 10)}T00:00:00Z`);
              const readableDate = eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              });
              const imageUrl =
                event.image && !event.image.includes("example.com")
                  ? event.image
                  : fallbackImage;

              return (
                <article className="latest-event-card" key={event._id}>
                  <div className="latest-event-image">
                    <img src={imageUrl} alt={event.title} />
                    <span className="latest-event-label">
                      <span aria-hidden="true">✦</span> Neighbourhood event
                    </span>
                    <div className="latest-event-date">
                      <span>{readableDate}</span>
                      <strong>{event.type}</strong>
                    </div>
                  </div>

                  <div className="latest-event-details">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <div className="latest-event-footer">
                      <span>
                        <span aria-hidden="true">⌖</span> {event.location}
                      </span>
                      <Link href={`/events/${event._id}`}>
                        Event details <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
