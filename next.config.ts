import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Typed links across the app for the foundations phase and beyond.
  typedRoutes: true,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Quiet build output; only upload source maps when an auth token is present.
  silent: !process.env.CI,
  telemetry: false,
  disableLogger: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Route Sentry through a rewrite to dodge ad-blockers (no-op without a DSN).
  tunnelRoute: '/monitoring',
});
