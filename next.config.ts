import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
