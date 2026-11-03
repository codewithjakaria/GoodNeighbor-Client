// Single source of truth for deployment URLs. Set NEXT_PUBLIC_API_URL
// and NEXT_PUBLIC_SITE_URL (e.g. on Vercel) when the backend or the
// site is not running on the defaults below.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
