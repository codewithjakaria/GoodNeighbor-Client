// Reads the ?redirect= query param that PrivateRoute appends when it
// sends a logged-out visitor to /login or /register.

// Only same-site absolute paths are honoured so the param can never
// turn into an open redirect (e.g. "//evil.com"). The auth pages
// themselves are excluded to avoid a redirect loop.
export function readRedirectParam(): string | null {
  if (typeof window === "undefined") return null;

  const redirect = new URLSearchParams(window.location.search).get("redirect");

  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    redirect !== "/login" &&
    redirect !== "/register"
  ) {
    return redirect;
  }

  return null;
}

// The destination to go to after a successful login/register:
// the original page when there was one, otherwise Upcoming Events.
export function getSafeRedirect(fallback = "/events"): string {
  return readRedirectParam() ?? fallback;
}
