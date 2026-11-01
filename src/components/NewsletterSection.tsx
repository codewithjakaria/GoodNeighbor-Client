"use client";

import type { FormEvent } from "react";
import { Check, Send } from "lucide-react";

const benefits = [
  "Weekly event updates",
  "Early access to drives",
  "Community stories",
];

export default function NewsletterSection() {
  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    // Design only — nothing is sent anywhere.
    event.preventDefault();
  }

  return (
    <section
      className="bg-[var(--nav-background)] px-4 pb-14 sm:px-6"
      aria-labelledby="newsletter-title"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <div className="relative overflow-hidden rounded-[30px] border border-[var(--nav-line)] bg-[var(--banner-soft)] p-8 sm:p-10">
          <span
            className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-[var(--banner-glow)] opacity-70 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="latest-event-eyebrow">Stay in the loop</span>
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl"
                id="newsletter-title"
              >
                Never miss a good deed near you
              </h2>
              <p className="mt-2 max-w-md text-xs leading-5 text-[var(--nav-muted)] sm:text-sm">
                Subscribe to get upcoming neighborhood events, volunteer
                opportunities, and community stories in your inbox.
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--nav-muted)]">
                {benefits.map((benefit) => (
                  <li className="inline-flex items-center gap-1.5" key={benefit}>
                    <Check className="size-3.5 text-[var(--nav-green)]" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <form className="flex flex-col gap-2.5 sm:flex-row" onSubmit={handleSubscribe}>
                <div className="w-full">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    className="h-11 w-full rounded-[12px] border border-[var(--nav-line)] bg-[var(--banner-card)] px-4 text-sm text-[var(--nav-ink)] placeholder:text-[var(--nav-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-green)]"
                    id="newsletter-email"
                    name="email"
                    placeholder="Enter your email address"
                    type="email"
                  />
                </div>
                <button
                  className="hero-button hero-button-primary w-full shrink-0 justify-center sm:w-auto"
                  type="submit"
                >
                  <Send className="size-4" aria-hidden="true" />
                  Subscribe
                </button>
              </form>
              <p className="mt-2.5 text-[11px] text-[var(--nav-muted)]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
