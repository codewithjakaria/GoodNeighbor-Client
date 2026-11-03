import Link from "next/link";
import { API_URL } from "@/lib/config";

type CommunityEvent = {
  _id?: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

const exampleEvent: CommunityEvent = {
  _id: "winter-clothes",
  title: "Winter Clothes Distribution",
  description: "Collect warm clothes and share them with neighbours who need them.",
  type: "Donation",
  image:
    "https://res.cloudinary.com/hy4kyit2a/f_auto%2Cfl_lossy%2Cq_70/learn/modules/trees-to-combat-climate-change/discover-how-salesforce-is-taking-action-with-nature-based-solutions/images/6c2ccbdd638de6fe7c9a9798e0a76bc1_kix.2lj1n3td520.png",
  location: "Mirpur 10, Dhaka",
  date: "2026-11-05",
};

async function getEvent() {
  const url = `${API_URL}/api/events?limit=1`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Banner] GET ${url} failed with status ${response.status}`);
      return exampleEvent;
    }

    const result: { data: CommunityEvent[] } = await response.json();

    if (Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0];
    }

    console.error(`[Banner] GET ${url} returned no events`);
  } catch (error) {
    console.error(`[Banner] GET ${url} failed:`, error);
    // Show the sample event when the server is not reachable.
  }

  return exampleEvent;
}

export default async function Banner() {
  const event = await getEvent();
  const imageUrl =
    event.image && !event.image.includes("example.com")
      ? event.image
      : exampleEvent.image;
  const eventDate = new Date(`${event.date.slice(0, 10)}T00:00:00Z`);
  const readableDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="banner-area">
      <section className="hero-banner page-width" aria-labelledby="hero-title">
        <div className="hero-message">
          <span className="hero-label">
            <span aria-hidden="true">✳</span> Dhaka&apos;s community action network
          </span>
          <h1 id="hero-title">
            Good starts with <span>good neighbours.</span>
          </h1>
          <p>
            Find a local cause, join people nearby, and turn a little time into
            something meaningful for your community.
          </p>

          <div className="hero-buttons">
            <Link className="hero-button hero-button-primary" href="/events">
              Find an event <span aria-hidden="true">→</span>
            </Link>
            <Link className="hero-button hero-button-secondary" href="/register">
              Be a neighbour <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="hero-causes" aria-label="Community event types">
            <span>Plant</span>
            <span>Share</span>
            <span>Care</span>
          </div>
        </div>

        <article className="latest-event-card">
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
            <span className="latest-event-eyebrow">Coming up near you</span>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <div className="latest-event-footer">
              <span>
                <span aria-hidden="true">⌖</span> {event.location}
              </span>
              <Link href={event._id && event._id !== "winter-clothes" ? `/events/${event._id}` : "/events"}>
                Event details <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        <span className="banner-decoration banner-decoration-one" aria-hidden="true" />
        <span className="banner-decoration banner-decoration-two" aria-hidden="true" />
      </section>
    </main>
  );
}
