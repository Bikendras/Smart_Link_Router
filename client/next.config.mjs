/** @type {import('next').NextConfig} */
const nextConfig = {
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
