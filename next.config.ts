import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable SSR capabilities
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
