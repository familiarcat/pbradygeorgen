// ✅ Load .env variables before anything else
require('dotenv').config();

/** @type {import('next').NextConfig} */

// ✅ Optional: Warn if missing OPENAI_API_KEY during build
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  Warning: OPENAI_API_KEY is not defined in .env.local or process.env');
}

const nextConfig = {
  env: {
    // ✅ Export it for client-side use if needed
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.express = false;
    return config;
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'app', 'utils', 'hooks'],
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
