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
    }
  }, []);

  function toggleTheme() {
    const nextTheme = darkTheme ? "light" : "dark";

    setDarkTheme(!darkTheme);
    localStorage.setItem("goodneighbor-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <header className="site-header">
      <div className="navbar-content">
        <Link className="brand" href="/" aria-label="GoodNeighbor home">
          <img
            className="brand-symbol"
            src="/goodneighbor-symbol.svg"
            alt=""
            width="40"
            height="40"
          />
          <span className="brand-name">GoodNeighbor</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/events">Upcoming Events</Link>
          <a href="/#how-it-works">How it works</a>
          <a href="/#community">Community</a>
        </nav>

        <div className="nav-actions">
          <button className="theme-button" type="button" onClick={toggleTheme}>
            <span aria-hidden="true">{darkTheme ? "☀" : "☾"}</span>
            {darkTheme ? "Light" : "Dark"}
          </button>
          <Link className="login-button" href="/login">
            Log in
          </Link>
          <Link className="join-button" href="/register">
            Join your neighbors <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
