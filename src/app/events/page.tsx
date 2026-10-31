import Navbar from "@/components/Navbar";

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
    <>
      <Navbar />
      <main className="events-page">
        <section className="events-heading">
          <span className="events-kicker">GOOD THINGS HAPPEN TOGETHER</span>
          <h1>Upcoming community events</h1>
          <p>Find a local event and join your neighbours in making a difference.</p>
        </section>

        {events.length === 0 ? (
          <p className="events-message">
            No upcoming events right now. Please check again soon.
          </p>
        ) : (
          <section className="events-grid" aria-label="Upcoming events">
            {events.map((event) => {
              const eventDate = new Date(`${event.date.slice(0, 10)}T00:00:00`);
              const imageUrl =
                event.image && !event.image.includes("example.com")
                  ? event.image
                  : "https://res.cloudinary.com/hy4kyit2a/f_auto%2Cfl_lossy%2Cq_70/learn/modules/trees-to-combat-climate-change/discover-how-salesforce-is-taking-action-with-nature-based-solutions/images/6c2ccbdd638de6fe7c9a9798e0a76bc1_kix.2lj1n3td520.png";

              return (
                <article className="event-card" key={event._id}>
                  <img className="event-card-image" src={imageUrl} alt={event.title} />
                  <div className="event-card-content">
                    <span className="event-card-type">{event.type}</span>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <div className="event-card-info">
                      <span>
                        {eventDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
