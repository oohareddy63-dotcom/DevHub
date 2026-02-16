/** @type {import('next').NextConfig} */
const nextConfig = {
  port: 3002,
  devServer: {
    port: 3002,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
