/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration
  webpack: (config) => {
    // Ignore canvas dependency
    config.resolve.alias.canvas = false;

    // Ignore express dependency in dante-logger
    config.resolve.alias.express = false;

    return config;
  },
  // React strict mode
  reactStrictMode: true,
  // ESLint configuration
  eslint: {
    // Ignore ESLint errors during builds to prevent blocking deployment
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'app', 'utils', 'hooks'],
  },
  // Improve build performance
  poweredByHeader: false,
  // Output configuration
  output: 'standalone',
};

export default nextConfig;
