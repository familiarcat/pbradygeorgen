import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable SSR capabilities
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
