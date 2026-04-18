import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response.
 * - HSTS: force HTTPS for 1y including subdomains; preload-eligible
 * - X-Frame-Options + frame-ancestors: prevent clickjacking
 * - X-Content-Type-Options: prevent MIME sniffing
 * - Referrer-Policy: strict by default
 * - Permissions-Policy: deny powerful features by default
 *
 * Note: a full CSP is intentionally not set yet — Next.js inline scripts +
 * Supabase + Vercel analytics make a strict CSP non-trivial. Track separately.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  env: {
    // Falls back to the Vercel-provided URL, then localhost for local dev
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
