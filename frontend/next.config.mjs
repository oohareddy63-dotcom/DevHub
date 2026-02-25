/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables with fallback for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://devhub-7.onrender.com/api',
  },
  // Only use rewrites in development
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4000/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
