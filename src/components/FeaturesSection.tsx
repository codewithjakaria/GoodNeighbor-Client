import {
  CalendarClock,
  HeartHandshake,
  MousePointerClick,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: HeartHandshake,
    title: "Community-Led Drives",
    description:
      "Anyone can organize cleanups, winter clothes drives, and food distribution in their area.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Participation",
    description:
      "Join an event in a single click and coordinate with local volunteers.",
  },
  {
    icon: SlidersHorizontal,
    title: "Creator Controls",
    description:
      "Manage, update, and track participation for your own events.",
  },
  {
    icon: CalendarClock,
    title: "Upcoming-Only Discovery",
    description:
      "Only future events are shown, so you always find active initiatives.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="bg-[var(--nav-background)] px-4 pb-14 sm:px-6"
      aria-labelledby="features-title"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <div className="mb-5 border-b border-border pb-4">
          <span className="latest-event-eyebrow">Why GoodNeighbor</span>
          <h2
            className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl"
            id="features-title"
          >
            Built for Neighborhood Action
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            A simple way to connect neighbors with local community initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="rounded-[21px] border border-[var(--nav-line)] bg-[var(--banner-card)] p-5 shadow-sm"
                key={feature.title}
              >
                <span className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--banner-soft)] text-[var(--nav-green)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold text-[var(--nav-ink)]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-[var(--nav-muted)]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
