/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production" ? true : false,
  swcMinify: true,
  output: "standalone",
};

module.exports = nextConfig;
