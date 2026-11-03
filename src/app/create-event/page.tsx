'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CalendarDays,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Tag,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PrivateRoute from '@/components/PrivateRoute';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const imagePresets = [
  {
    name: 'Winter clothes',
    url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Community garden',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Reading day',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tree planting',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const tokenResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:5000/api/auth/token',
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      const tokenResult: { token?: string; message?: string } =
        await tokenResponse.json();

      if (!tokenResponse.ok || !tokenResult.token) {
        toast.error(
          tokenResult.message || 'Please log in before creating an event.',
        );
        return;
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenResult.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          type,
          image,
          location,
          date,
        }),
      });
      const result: { message?: string; data?: { _id?: string } } =
        await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Could not create the event.');
        return;
      }

      toast.success('Event created successfully.');
      router.push('/events');
      router.refresh();
    } catch {
      toast.error(
        'Could not connect to the server. Please check that it is running.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
        <Navbar />
        <main className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-[860px]">
            <Link
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 no-underline hover:text-emerald-950 dark:text-emerald-200"
              href="/events"
            >
              <ArrowLeft className="size-4" />
              Back to events
            </Link>

            <Card className="rounded-2xl border-emerald-950/10 bg-white shadow-[0_18px_55px_-38px_rgba(20,70,48,0.35)] dark:bg-[#18251e]">
              <CardHeader className="gap-2 px-6 pb-3 pt-6 sm:px-8 sm:pt-8">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  <Sparkles className="size-3.5" /> Social service drive
                </span>
                <CardTitle className="pt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">
                  Create a community event
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  Organize a local relief effort, environmental cleanup, or
                  community support drive.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-6 sm:px-8">
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleCreateEvent}
                >
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="event-title"
                    >
                      Event title <span className="text-rose-600">*</span>
                    </label>
                    <Input
                      className="h-12 rounded-lg border-emerald-950/15 bg-white text-sm dark:bg-[#111a16]"
                      id="event-title"
                      onChange={event => setTitle(event.target.value)}
                      placeholder="e.g. Winter Clothes Distribution — Mirpur 10, Dhaka"
                      required
                      value={title}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="event-type"
                      >
                        Event type <span className="text-rose-600">*</span>
                      </label>
                      <select
                        className="h-11 rounded-lg border border-emerald-950/15 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:bg-[#111a16]"
                        id="event-type"
                        onChange={event => setType(event.target.value)}
                        required
                        value={type}
                      >
                        <option disabled value="">
                          Choose a type
                        </option>
                        <option value="Donation">Donation</option>
                        <option value="Cleanup">Cleanup</option>
                        <option value="Plantation">Plantation</option>
                        <option value="Community">Community</option>
                        <option value="Education">Education</option>
                        <option value="Health Camp">Health Camp</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="event-date"
                      >
                        Event date <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-700" />
                        <Input
                          className="h-11 rounded-lg border-emerald-950/15 bg-white pl-10 text-sm dark:bg-[#111a16]"
                          id="event-date"
                          min={getTomorrowDate()}
                          onChange={event => setDate(event.target.value)}
                          required
                          type="date"
                          value={date}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Choose a future date.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="event-location"
                    >
                      Location / venue <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-700" />
                      <Input
                        className="h-11 rounded-lg border-emerald-950/15 bg-white pl-10 text-sm dark:bg-[#111a16]"
                        id="event-location"
                        onChange={event => setLocation(event.target.value)}
                        placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                        required
                        value={location}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="event-image"
                    >
                      Thumbnail image URL{' '}
                      <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-700" />
                      <Input
                        className="h-11 rounded-lg border-emerald-950/15 bg-white pl-10 text-sm dark:bg-[#111a16]"
                        id="event-image"
                        onChange={event => setImage(event.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        required
                        type="url"
                        value={image}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                      <span>Quick photo choices:</span>
                      {imagePresets.map((preset, index) => (
                        <span
                          className="inline-flex items-center gap-2"
                          key={preset.name}
                        >
                          {index > 0 && <span aria-hidden="true">·</span>}
                          <button
                            className="font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                            onClick={() => setImage(preset.url)}
                            type="button"
                          >
                            {preset.name}
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="event-description"
                    >
                      Event description <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      className="min-h-32 rounded-lg border border-emerald-950/15 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-emerald-700 dark:bg-[#111a16]"
                      id="event-description"
                      onChange={event => setDescription(event.target.value)}
                      placeholder="Explain the purpose of the drive, volunteers needed, items being distributed or tasks to complete..."
                      required
                      value={description}
                    />
                  </div>

                  <div className="flex flex-col gap-2 rounded-xl border border-emerald-950/10 bg-[#f8faf8] px-4 py-3 text-xs dark:bg-[#111a16] sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-muted-foreground">
                      Organizer email is attached from your account
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-900 dark:text-emerald-100">
                      <Tag className="size-3.5" /> Added securely when you
                      create the event
                    </span>
                  </div>

                  <Button
                    className="h-11 rounded-lg bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Creating event...' : 'Create event'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
