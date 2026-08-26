import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow Google favicon service and any domain for product favicons
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
    // Also allow arbitrary external image URLs (for favicons)
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },

  // Required for Stripe webhook: disable body parsing for raw body access
  // (Next.js 13+ App Router handles this differently — no config needed)

  // Ensure the webhook route gets the raw body
  experimental: {},
}

export default nextConfig
