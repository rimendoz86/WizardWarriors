/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production" ? true : false,
  output: "standalone",
  distDir: "dist",
};

export default nextConfig;
