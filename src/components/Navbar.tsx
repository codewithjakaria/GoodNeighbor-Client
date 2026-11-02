"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarCheck, CalendarPlus, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";

type AuthUser = {
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const [darkTheme, setDarkTheme] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("goodneighbor-theme");

    if (savedTheme === "dark") {
      setDarkTheme(true);
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
    }

    async function loadUser() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:5000/api/auth/get-session',
          {
            credentials: 'include',
          },
        );
        const result = await response.json();

        if (response.ok && result.user) {
          setUser({
            name: result.user.name || "GoodNeighbor member",
            email: result.user.email || "",
            image: result.user.image || null,
          });
        }
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  function toggleTheme() {
    const nextTheme = darkTheme ? "light" : "dark";

    setDarkTheme(!darkTheme);
    localStorage.setItem("goodneighbor-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      await fetch(
        process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:5000/api/auth/sign-out',
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      toast.success("Logged out successfully.");
    } finally {
      setUser(null);
      setMenuOpen(false);
      setIsSigningOut(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="w-full border-b border-emerald-950/10 bg-[var(--nav-background)] text-[var(--nav-ink)] dark:border-emerald-100/10">
      <div className="mx-auto flex min-h-[86px] w-[calc(100%-32px)] max-w-[1160px] flex-wrap items-center justify-between gap-x-5 gap-y-3 py-3 sm:w-[calc(100%-48px)]">
        <Link
          className="flex shrink-0 items-center gap-2.5 text-lg font-extrabold tracking-[-0.05em] text-[var(--nav-ink)] no-underline sm:text-xl"
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

        <nav
          className="order-3 flex w-full items-center justify-center gap-5 border-t border-[var(--nav-line)] pt-3 text-xs font-semibold text-[var(--nav-muted)] sm:order-none sm:w-auto sm:gap-5 sm:border-0 sm:pt-0 sm:text-[13px]"
          aria-label="Main navigation"
        >
          <Link className="text-inherit no-underline hover:text-[var(--nav-green)]" href="/">
            Home
          </Link>
          <Link className="text-inherit no-underline hover:text-[var(--nav-green)]" href="/events">
            Upcoming Events
          </Link>
          <a className="text-inherit no-underline hover:text-[var(--nav-green)]" href="/#how-it-works">
            How it works
          </a>
          <a className="text-inherit no-underline hover:text-[var(--nav-green)]" href="/#community">
            Community
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[var(--nav-line)] bg-[var(--background)] px-3 text-[11px] font-bold text-[var(--nav-ink)] sm:h-11 sm:px-4 sm:text-xs"
            type="button"
            onClick={toggleTheme}
          >
            <span className="text-base text-[var(--nav-green)]" aria-hidden="true">
              {darkTheme ? "☀" : "☾"}
            </span>
            {darkTheme ? "Light" : "Dark"}
          </button>
          {user ? (
            <div className="relative">
              <button
                aria-expanded={menuOpen}
                aria-label="Open account menu"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--nav-line)] bg-[var(--background)] py-1 pl-1 pr-3 text-left text-[var(--nav-ink)]"
                onClick={() => setMenuOpen(!menuOpen)}
                type="button"
              >
                {user.image ? (
                  <img alt="" className="size-9 rounded-full object-cover" height="36" src={user.image} width="36" />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--nav-green)] text-sm font-bold text-white">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <ChevronDown className="size-4 text-[var(--nav-muted)]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-xl border border-emerald-950/10 bg-white py-2 text-sm shadow-xl dark:border-emerald-100/10 dark:bg-[#18251e]">
                  <div className="border-b border-emerald-950/10 px-4 py-3 dark:border-emerald-100/10">
                    <p className="truncate font-semibold text-emerald-950 dark:text-emerald-50">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link
                    className="flex items-center gap-2.5 px-4 py-3 text-emerald-950 no-underline hover:bg-emerald-50 dark:text-emerald-50 dark:hover:bg-emerald-950/50"
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserRound className="size-4 text-emerald-700 dark:text-emerald-300" />
                    My Profile
                  </Link>
                  <Link
                    className="flex items-center gap-2.5 px-4 py-3 text-emerald-950 no-underline hover:bg-emerald-50 dark:text-emerald-50 dark:hover:bg-emerald-950/50"
                    href="/create-event"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CalendarPlus className="size-4 text-emerald-700 dark:text-emerald-300" />
                    Create Event
                  </Link>
                  <Link
                    className="flex items-center gap-2.5 px-4 py-3 text-emerald-950 no-underline hover:bg-emerald-50 dark:text-emerald-50 dark:hover:bg-emerald-950/50"
                    href="/my-events"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="size-4 text-emerald-700 dark:text-emerald-300" />
                    Manage Events
                  </Link>
                  <Link
                    className="flex items-center gap-2.5 px-4 py-3 text-emerald-950 no-underline hover:bg-emerald-50 dark:text-emerald-50 dark:hover:bg-emerald-950/50"
                    href="/joined-events"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CalendarCheck className="size-4 text-emerald-700 dark:text-emerald-300" />
                    Joined Events
                  </Link>
                  <button
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/30"
                    disabled={isSigningOut}
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut className="size-4" />
                    {isSigningOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--nav-line)] px-3 text-[11px] font-bold text-[var(--nav-ink)] no-underline hover:bg-[var(--banner-soft)] sm:h-11 sm:px-4 sm:text-xs"
                href="/login"
              >
                Log in
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--nav-green)] px-3 text-[10px] font-bold text-white no-underline hover:bg-[var(--nav-green-deep)] sm:h-11 sm:px-4 sm:text-xs"
                href="/register"
              >
                Join your neighbors <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
