'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CalendarDays, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PrivateRoute from '@/components/PrivateRoute';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { API_URL } from '@/lib/config';

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

export default function JoinedEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleAuthError() {
    toast.error('Please log in to continue.', { id: 'auth-required' });
    router.replace(
      `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
    );
  }

  useEffect(() => {
    async function loadJoinedEvents() {
      try {
        const sessionResponse = await fetch(
          `${API_URL}/api/auth/get-session`,
          {
            credentials: 'include',
          },
        );
        const session = await sessionResponse.json();
        const email = session.user?.email;

        if (!sessionResponse.ok || !email) {
          handleAuthError();
          return;
        }

        const tokenResponse = await fetch(
          `${API_URL}/api/auth/token`,
          {
            credentials: 'include',
          },
        );
        const tokenResult = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenResult.token) {
          handleAuthError();
          return;
        }

        const response = await fetch(
          `${API_URL}/api/users/${encodeURIComponent(email)}/events`,
          { headers: { Authorization: `Bearer ${tokenResult.token}` } },
        );
        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || 'Could not load joined events.');
          return;
        }

        setEvents(result.data || []);
      } catch {
        toast.error('Could not connect to the server. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadJoinedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
        <Navbar />
        <main className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-[1160px]">
            <header className="mb-6 border-b border-emerald-950/10 pb-4 dark:border-emerald-100/10">
              <Badge className="mb-2 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200">
                YOUR COMMUNITY CALENDAR
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Joined Events
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Events you have chosen to take part in.
              </p>
            </header>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Loading joined events...
              </p>
            ) : events.length === 0 ? (
              <Card className="rounded-2xl border-emerald-950/10 bg-white p-8 text-center dark:bg-[#18251e]">
                <h2 className="text-lg font-semibold">
                  You have not joined an event yet.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore upcoming events and find a cause near you.
                </p>
                <Link
                  className="mt-5 inline-flex h-9 items-center rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white no-underline hover:bg-emerald-800"
                  href="/events"
                >
                  Explore events
                </Link>
              </Card>
            ) : (
              <section
                aria-label="Events you joined"
                className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {events.map(event => (
                  <Card
                    className="overflow-hidden rounded-2xl border-emerald-950/10 bg-white py-0 shadow-sm dark:bg-[#18251e]"
                    key={event._id}
                  >
                    <img
                      alt={event.title}
                      className="h-44 w-full object-cover"
                      src={event.image}
                    />
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge className="rounded-full bg-emerald-50 text-[10px] text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200">
                          {event.type}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {event.date}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold">{event.title}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        {event.location}
                      </p>
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
