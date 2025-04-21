/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable SSR capabilities
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during builds to prevent blocking deployment
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'app', 'utils', 'hooks'],
  },
};

module.exports = nextConfig;
