/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables with fallback for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://devhub-7.onrender.com/api',
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
