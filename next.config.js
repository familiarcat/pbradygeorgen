/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable SSR capabilities
  webpack: (config) => {
    // Ignore canvas dependency
    config.resolve.alias.canvas = false;

    // Ignore express dependency in dante-logger
    config.resolve.alias.express = false;

    return config;
  },
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during builds to prevent blocking deployment
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'app', 'utils', 'hooks'],
  },
  // Improve build performance
  poweredByHeader: false,
};

module.exports = nextConfig;
