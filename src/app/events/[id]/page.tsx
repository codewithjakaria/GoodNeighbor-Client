"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, HeartHandshake, MapPin, Share2, UserRound, UsersRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
  creatorEmail: string;
  joinedEmails?: string[];
};

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [joinedByThisUser, setJoinedByThisUser] = useState(false);
  const [message, setMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const [eventResponse, sessionResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/events/${eventId}`),
          fetch("http://localhost:5000/api/auth/get-session", { credentials: "include" }),
        ]);
        const eventResult = await eventResponse.json();
        const sessionResult = await sessionResponse.json();

        if (!eventResponse.ok) {
          throw new Error(eventResult.message || "Could not find this event.");
        }

        setEvent(eventResult.data);
        setUserEmail(sessionResult.user?.email?.toLowerCase() || "");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load this event.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleJoin() {
    setMessage("");
    setIsJoining(true);

    try {
      const tokenResponse = await fetch("http://localhost:5000/api/auth/token", {
        credentials: "include",
      });
      const tokenResult = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenResult.token) {
        setMessage("Please log in to join this event.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenResult.token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Could not join this event.");
        return;
      }

      setEvent(result.data);
      setJoinedByThisUser(true);
      setMessage("You joined the event successfully.");
    } catch {
      setMessage("Could not connect to the server. Please try again.");
    } finally {
      setIsJoining(false);
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Event link copied.");
      }
    } catch {
      setShareMessage("Copy the event link from your browser address bar.");
    }
  }

  const alreadyJoined = joinedByThisUser || Boolean(
    userEmail && event?.joinedEmails?.some((email) => email.toLowerCase() === userEmail),
  );
  const readableDate = event
    ? new Date(`${event.date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
      <Navbar />
      <main className="px-4 py-7 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-[1120px]">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 no-underline hover:text-emerald-950 dark:text-emerald-200" href="/events">
            <ArrowLeft className="size-4" /> Back to Upcoming Events
          </Link>

          {isLoading ? (
            <Card className="overflow-hidden rounded-2xl border-emerald-950/10 bg-white dark:bg-[#18251e]">
              <div className="h-72 animate-pulse bg-emerald-100 dark:bg-emerald-950/50" />
              <CardContent className="space-y-3 p-6">
                <div className="h-5 w-1/3 animate-pulse rounded bg-emerald-100 dark:bg-emerald-950/50" />
                <div className="h-8 w-2/3 animate-pulse rounded bg-emerald-100 dark:bg-emerald-950/50" />
                <div className="h-4 w-full animate-pulse rounded bg-emerald-100 dark:bg-emerald-950/50" />
              </CardContent>
            </Card>
          ) : event ? (
            <div className="space-y-5">
              <section className="relative isolate min-h-[330px] overflow-hidden rounded-[28px] bg-emerald-950 sm:min-h-[410px]" aria-labelledby="event-title">
                <img
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(image) => {
                    image.currentTarget.src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80";
                  }}
                  src={event.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/25 to-emerald-950/10" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 sm:p-7">
                  <Badge className="rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-white/90">
                    <HeartHandshake className="mr-1 size-3.5" /> {event.type}
                  </Badge>
                  <span className="rounded-full border border-white/30 bg-emerald-950/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
                    GoodNeighbor community event
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-9">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">A little time can make a difference</p>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl" id="event-title">
                    {event.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/90 sm:text-sm">
                    <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-emerald-200" />{event.location}</span>
                    <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-emerald-200" />{readableDate}</span>
                  </div>
                </div>
              </section>

              <Card className="rounded-2xl border-emerald-950/10 bg-white shadow-sm dark:bg-[#18251e]">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                      <UsersRound className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{event.joinedEmails?.length || 0} neighbours joined</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Be part of this community effort.</p>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                    <Button className="h-10 rounded-lg" onClick={handleShare} type="button" variant="outline">
                      <Share2 className="size-4" /> Share
                    </Button>
                    {alreadyJoined ? (
                      <Button className="h-10 rounded-lg bg-emerald-100 px-5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-100" disabled>
                        <Check className="size-4" /> You joined
                      </Button>
                    ) : (
                      <Button className="h-10 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800" disabled={isJoining} onClick={handleJoin} type="button">
                        <HeartHandshake className="size-4" /> {isJoining ? "Joining..." : "Join Event"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {(message || shareMessage) && (
                <p aria-live="polite" className="rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-900 dark:bg-[#18251e] dark:text-emerald-100">
                  {message || shareMessage}
                  {message.toLowerCase().includes("log in") && (
                    <Link className="ml-1 font-semibold underline" href="/login">Log in</Link>
                  )}
                </p>
              )}

              <div className="grid gap-5 lg:grid-cols-[1.6fr_0.8fr]">
                <Card className="rounded-2xl border-emerald-950/10 bg-white shadow-sm dark:bg-[#18251e]">
                  <CardContent className="p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">The plan</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">About this event</h2>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{event.description}</p>
                    <div className="mt-6 grid gap-3 border-t border-emerald-950/10 pt-5 text-sm dark:border-emerald-100/10 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">When</p>
                        <p className="mt-1 font-medium">{readableDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Where</p>
                        <p className="mt-1 font-medium">{event.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-emerald-950/10 bg-[#f5f8f3] shadow-sm dark:bg-[#18251e]">
                  <CardContent className="p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">The person behind it</p>
                    <div className="mt-4 flex size-12 items-center justify-center rounded-full bg-emerald-700 text-white">
                      <UserRound className="size-5" />
                    </div>
                    <h2 className="mt-3 text-lg font-semibold">Event organizer</h2>
                    <p className="mt-1 break-all text-sm text-muted-foreground">{event.creatorEmail}</p>
                    <p className="mt-4 border-t border-emerald-950/10 pt-4 text-xs leading-5 text-muted-foreground dark:border-emerald-100/10">
                      This community member created the event and will welcome volunteers at the location.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="rounded-2xl border-emerald-950/10 bg-white p-8 text-center dark:bg-[#18251e]">
              <h1 className="text-xl font-semibold">Event not found</h1>
              <p className="mt-2 text-sm text-muted-foreground">{message || "This event may have been removed."}</p>
              <Link className="mt-5 inline-flex h-9 items-center rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white no-underline hover:bg-emerald-800" href="/events">Browse upcoming events</Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
