"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarCheck, CalendarPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileForm, { type ProfileUser } from "@/components/ProfileForm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api";

type StatsState = {
  created?: number;
  joined?: number;
};

async function fetchSession(): Promise<ProfileUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      credentials: "include",
    });
    const result: { user?: ProfileUser } = await response.json().catch(() => ({}));

    if (response.ok && result.user) {
      return result.user;
    }
  } catch {
    // Treated as logged out below.
  }

  return null;
}

function isHttpsUrl(value?: string | null) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [stats, setStats] = useState<StatsState>({});
  const [statsReady, setStatsReady] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      const sessionUser = await fetchSession();
      if (!isActive) return;

      if (!sessionUser) {
        // Only redirect once the session request has resolved — never
        // while it is still loading.
        toast.error("Please log in to continue.", { id: "auth-required" });
        router.replace("/login");
        return;
      }

      setUser(sessionUser);
      setAvatarFailed(false);
      setIsLoading(false);
    }

    loadSession();

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    const email = user?.email;
    if (!email) return;

    let isActive = true;

    const loadStats = async () => {
      const next: StatsState = {};

      try {
        const tokenResponse = await fetch(`${API_BASE_URL}/api/auth/token`, {
          credentials: "include",
        });
        const tokenResult: { token?: string } = await tokenResponse
          .json()
          .catch(() => ({}));

        if (tokenResponse.ok && tokenResult.token) {
          const headers = { Authorization: `Bearer ${tokenResult.token}` };

          const [createdResponse, joinedResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/my-events`, { headers }).catch(() => null),
            fetch(
              `${API_BASE_URL}/api/users/${encodeURIComponent(email)}/events`,
              { headers }
            ).catch(() => null),
          ]);

          if (createdResponse?.ok) {
            const createdResult: { data?: unknown[] } = await createdResponse
              .json()
              .catch(() => ({}));
            if (Array.isArray(createdResult.data)) {
              next.created = createdResult.data.length;
            }
          }

          if (joinedResponse?.ok) {
            const joinedResult: { data?: unknown[] } = await joinedResponse
              .json()
              .catch(() => ({}));
            if (Array.isArray(joinedResult.data)) {
              next.joined = joinedResult.data.length;
            }
          }
        }
      } catch {
        // Failed stats are hidden instead of crashing the page.
      }

      if (!isActive) return;
      setStats(next);
      setStatsReady(true);
    };

    loadStats();

    return () => {
      isActive = false;
    };
  }, [user?.email]);

  async function handleUpdated() {
    // Refresh the session so the page and the navbar avatar show the
    // new details immediately. The key bump remounts the navbar so it
    // re-reads the session, just like navigating to another page.
    const sessionUser = await fetchSession();
    if (sessionUser) {
      setUser(sessionUser);
      setAvatarFailed(false);
    }
    setSessionVersion((version) => version + 1);
  }

  const displayName = user?.name?.trim() || "GoodNeighbor member";
  const avatarUrl = user?.image?.trim() || "";
  const useNextImage = isHttpsUrl(avatarUrl) && !avatarFailed;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const hasAnyStat = statsReady && (stats.created !== undefined || stats.joined !== undefined);

  return (
    <div className="min-h-screen bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50">
      <Navbar key={sessionVersion} />
      <main className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-[1160px]">
          <header className="mb-6 border-b border-emerald-950/10 pb-4 dark:border-emerald-100/10">
            <Badge className="mb-2 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200">
              YOUR ACCOUNT
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage how you show up in the community.
            </p>
          </header>

          {isLoading ? (
            <div aria-busy="true" aria-label="Loading your profile" className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              <div className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm dark:border-emerald-100/10 dark:bg-[#18251e] lg:col-span-2">
                <div className="size-28 animate-pulse rounded-full bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-4 h-6 w-40 animate-pulse rounded bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-2 h-4 w-52 animate-pulse rounded bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-20 animate-pulse rounded-xl bg-emerald-950/10 dark:bg-emerald-50/10" />
                  <div className="h-20 animate-pulse rounded-xl bg-emerald-950/10 dark:bg-emerald-50/10" />
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm dark:border-emerald-100/10 dark:bg-[#18251e] lg:col-span-3">
                <div className="h-6 w-44 animate-pulse rounded bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-6 h-11 w-full animate-pulse rounded-lg bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-4 h-11 w-full animate-pulse rounded-lg bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-4 h-11 w-full animate-pulse rounded-lg bg-emerald-950/10 dark:bg-emerald-50/10" />
                <div className="mt-6 h-10 w-36 animate-pulse rounded-lg bg-emerald-950/10 dark:bg-emerald-50/10" />
              </div>
            </div>
          ) : user ? (
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
              <Card className="rounded-2xl border-emerald-950/10 bg-white p-6 shadow-sm dark:border-emerald-100/10 dark:bg-[#18251e] lg:col-span-2">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
                  {useNextImage ? (
                    <span className="relative size-28 shrink-0 overflow-hidden rounded-full shadow-sm">
                      <Image
                        alt={`${displayName}'s profile photo`}
                        className="object-cover"
                        fill
                        onError={() => setAvatarFailed(true)}
                        sizes="112px"
                        src={avatarUrl}
                      />
                    </span>
                  ) : (
                    <span className="flex size-28 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white">
                      {getInitials(displayName)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold sm:text-2xl">{displayName}</h2>
                    <p className="mt-0.5 break-all text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    {memberSince && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Member since {memberSince}
                      </p>
                    )}
                  </div>
                </div>

                {!statsReady ? (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-20 animate-pulse rounded-xl bg-emerald-950/10 dark:bg-emerald-50/10" />
                    <div className="h-20 animate-pulse rounded-xl bg-emerald-950/10 dark:bg-emerald-50/10" />
                  </div>
                ) : hasAnyStat ? (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {stats.created !== undefined && (
                      <div className="rounded-xl border border-emerald-950/10 bg-[#f8faf8] p-4 dark:border-emerald-100/10 dark:bg-[#111a16]">
                        <CalendarPlus
                          className="size-4 text-emerald-700 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        <p className="mt-2 text-2xl font-semibold">{stats.created}</p>
                        <p className="text-xs text-muted-foreground">Events created</p>
                      </div>
                    )}
                    {stats.joined !== undefined && (
                      <div className="rounded-xl border border-emerald-950/10 bg-[#f8faf8] p-4 dark:border-emerald-100/10 dark:bg-[#111a16]">
                        <CalendarCheck
                          className="size-4 text-emerald-700 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        <p className="mt-2 text-2xl font-semibold">{stats.joined}</p>
                        <p className="text-xs text-muted-foreground">Events joined</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </Card>

              <div className="lg:col-span-3">
                <ProfileForm user={user} onUpdated={handleUpdated} />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
