/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable SSR capabilities
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
  eslint: {
    // Warning instead of error for production builds
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'app', 'utils', 'hooks'],
  },
};

module.exports = nextConfig;
