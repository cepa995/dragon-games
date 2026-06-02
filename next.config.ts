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

export default nextConfig;
