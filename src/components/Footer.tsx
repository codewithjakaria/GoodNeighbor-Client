import Link from "next/link";
import { Globe, Heart, MapPin } from "lucide-react";

const exploreLinks = [
  { label: "Upcoming Events", href: "/events" },
  { label: "Create an Event", href: "/create-event" },
  { label: "Manage My Events", href: "/my-events" },
  { label: "My Joined Events", href: "/joined-events" },
];

const activeCauses = [
  "Winter Clothes Distribution",
  "Neighborhood Clean-up",
  "Tree Plantation Drives",
  "Food Sharing",
  "Free Health Camps",
];

export default function Footer() {
  return (
    <footer className="border-t border-emerald-950/10 bg-[var(--nav-background)] dark:border-emerald-100/10">
      <div className="mx-auto w-full max-w-[1160px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link
              className="flex w-fit items-center gap-2.5 text-lg font-extrabold tracking-[-0.05em] text-[var(--nav-ink)] no-underline"
              href="/"
              aria-label="GoodNeighbor home"
            >
              <img
                className="size-11"
                src="/goodneighbor-symbol.svg"
                alt=""
                width="44"
                height="44"
              />
              <span>GoodNeighbor</span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-5 text-[var(--nav-muted)]">
              A community-driven platform helping neighbors create, join, and
              track meaningful local events.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--nav-muted)]">
              <MapPin className="size-3.5 text-[var(--nav-green)]" aria-hidden="true" />
              Dhaka, Bangladesh
            </p>
          </div>

          <nav aria-label="Explore platform">
            <span className="latest-event-eyebrow">Explore Platform</span>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--nav-muted)]">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-inherit no-underline transition-colors hover:text-[var(--nav-green)]"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <span className="latest-event-eyebrow">Active Causes</span>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--nav-muted)]">
              {activeCauses.map((cause) => (
                <li className="inline-flex items-center gap-2" key={cause}>
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-[var(--nav-green)]"
                    aria-hidden="true"
                  />
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="latest-event-eyebrow">Community Spirit</span>
            <p className="mt-4 max-w-xs text-xs leading-5 text-[var(--nav-muted)]">
              Every small action counts. Connect with local volunteers and turn
              compassion into direct community aid.
            </p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--nav-line)] bg-[var(--background)] px-3 py-1.5 text-[11px] font-semibold text-[var(--nav-ink)]">
              <Globe className="size-3.5 text-[var(--nav-green)]" aria-hidden="true" />
              100% Volunteer Driven
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-emerald-950/10 pt-5 text-[11px] text-[var(--nav-muted)] dark:border-emerald-100/10 sm:flex-row">
          <p>© {new Date().getFullYear()} GoodNeighbor. Built with care for community service.</p>
          <p className="inline-flex items-center gap-1">
            Made with{" "}
            <Heart className="size-3.5 fill-current text-[var(--nav-green)]" aria-hidden="true" />{" "}
            for a better tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
}
