"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PrivateRoute from "@/components/PrivateRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type CommunityEvent = {
  _id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
  date: string;
};

type ApiResult = {
  message?: string;
  token?: string;
  data?: CommunityEvent[] | CommunityEvent;
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getToken() {
  const response = await fetch("http://localhost:5000/api/auth/token", {
    credentials: "include",
  });
  const result: ApiResult = await response.json();

  if (!response.ok || !result.token) {
    throw new Error("Please log in to view your events.");
  }

  return result.token;
}

export default function MyEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CommunityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  function handleAuthError() {
    toast.error("Please log in to continue.", { id: "auth-required" });
    router.replace(
      `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
    );
  }

  useEffect(() => {
    async function loadMyEvents() {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/api/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result: ApiResult = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load your events.");
        }

        setEvents(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Could not load your events.";

        if (errorMessage.toLowerCase().includes("log in")) {
          handleAuthError();
          return;
        }

        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEvent) return;

    const formData = new FormData(event.currentTarget);
    const updatedFields = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      type: String(formData.get("type")),
      image: String(formData.get("image")),
      location: String(formData.get("location")),
      date: String(formData.get("date")),
    };

    setBusyId(editingEvent._id);

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const result: ApiResult = await response.json();

      if (!response.ok || !result.data || Array.isArray(result.data)) {
        throw new Error(result.message || "Could not update this event.");
      }

      setEvents(events.map((item) => item._id === editingEvent._id ? result.data as CommunityEvent : item));
      setEditingEvent(null);
      toast.success("Event updated.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Could not update this event.";

      if (errorMessage.toLowerCase().includes("log in")) {
        handleAuthError();
        return;
      }

      toast.error(errorMessage);
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(eventId: string) {
    setBusyId(eventId);
    const loadingToastId = toast.loading("Deleting event...");

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: ApiResult = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete this event.");
      }

      setEvents(events.filter((event) => event._id !== eventId));
      if (editingEvent?._id === eventId) setEditingEvent(null);
      toast.success("Event deleted.", { id: loadingToastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Could not delete this event.";

      if (errorMessage.toLowerCase().includes("log in")) {
        toast.dismiss(loadingToastId);
        handleAuthError();
        return;
      }

      toast.error(errorMessage, { id: loadingToastId });
    } finally {
      setBusyId("");
      setDeleteTarget(null);
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
        <Navbar />
        <main className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-[1160px]">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-emerald-950/10 pb-4 dark:border-emerald-100/10">
              <div>
                <Badge className="mb-2 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200">
                  YOUR COMMUNITY WORK
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Events</h1>
                <p className="mt-1 text-sm text-muted-foreground">Events you have created for your neighbours.</p>
              </div>
              <Link className="inline-flex h-9 items-center rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white no-underline hover:bg-emerald-800" href="/create-event">
                Create event
              </Link>
            </header>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Loading your events...</p>
            ) : events.length === 0 ? (
              <Card className="rounded-2xl border-emerald-950/10 bg-white p-8 text-center dark:bg-[#18251e]">
                <h2 className="text-lg font-semibold">You have not created any events yet.</h2>
                <p className="mt-2 text-sm text-muted-foreground">Create your first event and invite your neighbours.</p>
                <Link className="mt-5 inline-flex h-9 items-center rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white no-underline hover:bg-emerald-800" href="/create-event">
                  Create your first event
                </Link>
              </Card>
            ) : (
              <section aria-label="Your created events" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <Card className="overflow-hidden rounded-2xl border-emerald-950/10 bg-white py-0 shadow-sm dark:bg-[#18251e]" key={event._id}>
                    <img alt={event.title} className="h-44 w-full object-cover" src={event.image} />
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge className="rounded-full bg-emerald-50 text-[10px] text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200">{event.type}</Badge>
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarDays className="size-3.5" /> {event.date}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold">{event.title}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" /> {event.location}
                      </p>
                      <p className="mt-3 line-clamp-3 min-h-12 text-xs leading-5 text-muted-foreground">{event.description}</p>

                      {editingEvent?._id === event._id ? (
                        <form className="mt-4 flex flex-col gap-3 border-t border-emerald-950/10 pt-4" onSubmit={handleUpdate}>
                          <Input className="h-9 text-xs" defaultValue={event.title} name="title" placeholder="Event title" required />
                          <textarea className="min-h-20 rounded-lg border border-input bg-transparent px-3 py-2 text-xs" defaultValue={event.description} name="description" placeholder="Description" required />
                          <div className="grid grid-cols-2 gap-2">
                            <select className="h-9 rounded-lg border border-input bg-background px-2 text-xs" defaultValue={event.type} name="type" required>
                              <option value="Donation">Donation</option><option value="Cleanup">Cleanup</option><option value="Plantation">Plantation</option><option value="Community">Community</option><option value="Education">Education</option><option value="Health Camp">Health Camp</option>
                            </select>
                            <Input className="h-9 text-xs" defaultValue={event.date} min={getTomorrowDate()} name="date" type="date" required />
                          </div>
                          <Input className="h-9 text-xs" defaultValue={event.location} name="location" placeholder="Location" required />
                          <Input className="h-9 text-xs" defaultValue={event.image} name="image" placeholder="Image URL" type="url" required />
                          <div className="flex gap-2">
                            <Button className="h-9 flex-1 bg-emerald-700 text-xs text-white hover:bg-emerald-800" disabled={busyId === event._id} type="submit">Save changes</Button>
                            <Button className="h-9 text-xs" onClick={() => setEditingEvent(null)} type="button" variant="outline">Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-4 flex gap-2 border-t border-emerald-950/10 pt-3">
                          <Button className="h-9 flex-1 text-xs" onClick={() => setEditingEvent(event)} type="button" variant="outline">
                            <Pencil className="size-3.5" /> Edit
                          </Button>
                          <Button className="h-9 text-xs" disabled={busyId === event._id} onClick={() => setDeleteTarget(event)} type="button" variant="outline">
                            <Trash2 className="size-3.5" /> Delete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}
          </div>
        </main>

        <Dialog
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          open={Boolean(deleteTarget)}
        >
          <DialogContent>
            <DialogTitle className="text-lg font-semibold">
              Delete this event?
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              This will permanently remove &ldquo;{deleteTarget?.title}&rdquo;. This
              action cannot be undone.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                className="h-9 rounded-lg text-xs"
                onClick={() => setDeleteTarget(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="h-9 rounded-lg bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
                disabled={busyId === deleteTarget?._id}
                onClick={() => {
                  if (deleteTarget) handleDelete(deleteTarget._id);
                }}
                type="button"
              >
                {busyId === deleteTarget?._id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
