/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Webpack configuration
  webpack: (config) => {
    // Ignore canvas dependency
    config.resolve.alias.canvas = false;

    // Ignore express dependency in dante-logger
    config.resolve.alias.express = false;

    // Disable Tailwind CSS for Amplify build
    config.resolve.alias['tailwindcss'] = false;
    config.resolve.alias['postcss'] = false;
    config.resolve.alias['autoprefixer'] = false;
    config.resolve.alias['@tailwindcss/postcss'] = false;

    // Add explicit path aliases for AWS Amplify compatibility
    config.resolve.alias['@/utils'] = path.join(__dirname, 'utils');
    config.resolve.alias['@/components'] = path.join(__dirname, 'components');
    config.resolve.alias['@/app'] = path.join(__dirname, 'app');
    config.resolve.alias['@/hooks'] = path.join(__dirname, 'hooks');
    config.resolve.alias['@/styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['@/public'] = path.join(__dirname, 'public');

    return config;
  },
  // React strict mode
  reactStrictMode: true,
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Output configuration
  output: 'standalone',
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable image optimization for Amplify
  images: {
    unoptimized: true,
  },
  // Increase memory limit for builds
  experimental: {
    // Increase memory limit for builds
    memoryBasedWorkersCount: true,
  },
};

module.exports = nextConfig;
