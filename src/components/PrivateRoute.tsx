"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SessionStatus = "loading" | "authed" | "guest";

/**
 * Wraps a private page's content. Reads the session the same way the
 * Navbar does (fetch get-session with credentials: "include").
 */
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<SessionStatus>("loading");
  const redirectStarted = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/get-session", {
          credentials: "include",
        });
        const result: { user?: unknown } = await response.json().catch(() => ({}));

        if (!isActive) return;
        setStatus(response.ok && result.user ? "authed" : "guest");
      } catch {
        if (!isActive) return;
        setStatus("guest");
      }
    }

    loadSession();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    // Never redirect while the session request is still in flight, and
    // only ever fire the toast/redirect once (React strict mode safety).
    if (status !== "guest" || redirectStarted.current) return;
    redirectStarted.current = true;

    toast.error("Please log in to continue.", { id: "auth-required" });
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status === "authed") {
    return <>{children}</>;
  }

  if (status === "guest") {
    // Render nothing while the redirect happens — no flash of the form.
    return null;
  }

  return (
    <div
      aria-busy="true"
      aria-label="Checking your session"
      className="flex min-h-screen items-center justify-center bg-[#eaf2e8] text-emerald-950 dark:bg-[#202f27] dark:text-emerald-50"
      role="status"
    >
      <span className="size-9 animate-spin rounded-full border-[3px] border-emerald-950/15 border-t-emerald-700 dark:border-emerald-100/15 dark:border-t-emerald-300" />
    </div>
  );
}
