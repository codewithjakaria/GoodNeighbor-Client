"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("goodneighbor-theme");

    if (savedTheme === "dark") {
      setDarkTheme(true);
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = darkTheme ? "light" : "dark";

    setDarkTheme(!darkTheme);
    localStorage.setItem("goodneighbor-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <header className="w-full border-b border-emerald-950/10 bg-[#eaf2e8] text-[var(--nav-ink)] dark:border-emerald-100/10 dark:bg-[#202f27]">
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
          <Link
            className="hidden h-10 items-center justify-center rounded-full border border-[var(--nav-line)] px-4 text-xs font-bold text-[var(--nav-ink)] no-underline hover:bg-[var(--banner-soft)] sm:inline-flex sm:h-11"
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
        </div>
      </div>
    </header>
  );
}
