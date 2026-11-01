import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

type CommunityEvent = {
  _id: string;
  title: string;
  description?: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

// Same base URL the Recent Events section uses.
const API_BASE_URL = "http://localhost:5000";

const MAX_GALLERY_ITEMS = 8;

function isValidImage(image?: string) {
  return (
    typeof image === "string" &&
    image.trim().length > 0 &&
    !image.includes("example.com")
  );
}

function eventTimestamp(event: CommunityEvent) {
  const time = Date.parse(event.date?.slice(0, 10) ?? "");
  return Number.isNaN(time) ? 0 : time;
}

async function getGalleryEvents(): Promise<CommunityEvent[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events?all=1`, {
      cache: "no-store",
    });
    const result: { data?: CommunityEvent[] } = await response.json();

    if (!response.ok || !Array.isArray(result.data)) {
      return [];
    }

    const seenImages = new Set<string>();

    return result.data
      .filter((event) => {
        if (!isValidImage(event.image) || seenImages.has(event.image)) {
          return false;
        }
        seenImages.add(event.image);
        return true;
      })
      .sort((first, second) => eventTimestamp(second) - eventTimestamp(first))
      .slice(0, MAX_GALLERY_ITEMS);
  } catch {
    // Show the empty state when the server is not running.
    return [];
  }
}

export default async function GallerySection() {
  const events = await getGalleryEvents();

  return (
    <section
      className="bg-[var(--nav-background)] px-4 pb-14 sm:px-6"
      aria-labelledby="gallery-title"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <div className="mb-5 border-b border-border pb-4">
          <span className="latest-event-eyebrow">Our Gallery</span>
          <h2
            className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl"
            id="gallery-title"
          >
            Moments from our community
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            A look at the cleanups, drives, and plantations our neighbors have
            made possible.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="rounded-[21px] border border-[var(--nav-line)] bg-[var(--banner-card)] py-12 text-center text-sm text-[var(--nav-muted)]">
            No photos yet — once neighbors start sharing events, their moments
            will appear right here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => {
              const hasDate = Boolean(event.date);
              const readableDate = hasDate
                ? new Date(`${event.date.slice(0, 10)}T00:00:00Z`).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    }
                  )
                : null;

              return (
                <Link
                  className="group relative block overflow-hidden rounded-[21px] border border-[var(--nav-line)] bg-[var(--banner-card)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  href={`/events/${event._id}`}
                  key={event._id}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      alt={event.title}
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                      src={event.image}
                    />

                    <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <span className="mb-1.5 inline-flex w-fit items-center rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {event.type}
                      </span>
                      <h3 className="text-sm font-semibold leading-5 text-white">
                        {event.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-white/85">
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" aria-hidden="true" />
                            {event.location}
                          </span>
                        )}
                        {readableDate && <span>{readableDate}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
