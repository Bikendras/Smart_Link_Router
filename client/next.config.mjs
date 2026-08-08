import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: keep file tracing inside this repo (fixes Vercel "Collecting build traces" failures)
  outputFileTracingRoot: path.join(__dirname, '..'),

  // Don't fail production build on ESLint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Avoid double useEffect / duplicate API calls in development
  reactStrictMode: false,

  // Old /admin/* bookmarks → /dashboard/*
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/links',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/dashboard/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
