/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
