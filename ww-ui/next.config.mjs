/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production" ? true : false,
  output: "standalone",
};

export default nextConfig;
