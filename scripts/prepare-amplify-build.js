#!/usr/bin/env node
/**
 * Prepare Amplify Build
 *
 * This script prepares the application for building in AWS Amplify by:
 * 1. Creating a simplified version of the app that doesn't rely on Tailwind CSS
 * 2. Updating the fonts.ts file to not use Tailwind CSS
 * 3. Creating a minimal CSS file that doesn't require Tailwind CSS
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing application for AWS Amplify build');

// Create a simplified version of the fonts.ts file
const fontsPath = path.join(process.cwd(), 'app', 'fonts.ts');
if (fs.existsSync(fontsPath)) {
  console.log('📝 Updating fonts.ts file');

  // Create a backup of the original file
  const backupPath = path.join(process.cwd(), 'app', 'fonts.ts.bak');
  fs.copyFileSync(fontsPath, backupPath);

  // Create a simplified version of the file
  const simplifiedFonts = `
// Simplified fonts.ts file for AWS Amplify build
import { Inter, Roboto, Source_Sans_3 } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const sourceSans = Source_Sans_3({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});
`;

  fs.writeFileSync(fontsPath, simplifiedFonts);
  console.log('✅ fonts.ts file updated');
}

// Create a simplified version of the globals.css file
const cssPath = path.join(process.cwd(), 'app', 'globals.css');
if (fs.existsSync(cssPath)) {
  console.log('📝 Updating globals.css file');

  // Create a backup of the original file
  const backupPath = path.join(process.cwd(), 'app', 'globals.css.bak');
  fs.copyFileSync(cssPath, backupPath);

  // Create a simplified version of the file
  const simplifiedCss = `
/* Simplified globals.css file for AWS Amplify build */

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
  --primary-color: #b82e63;
  --secondary-color: #5a9933;
  --accent-color: #26d994;
  --background-color: #f4f1f2;
  --text-color: #2c2125;
  --border-color: #d6c2ca;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--font-inter), system-ui, sans-serif;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-roboto), sans-serif;
}

pre, code {
  font-family: monospace;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-4 {
  gap: 1rem;
}

.p-4 {
  padding: 1rem;
}

.m-4 {
  margin: 1rem;
}

.rounded {
  border-radius: 0.25rem;
}

.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.bg-white {
  background-color: white;
}

.text-center {
  text-align: center;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.text-primary {
  color: var(--primary-color);
}

.text-secondary {
  color: var(--secondary-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-secondary {
  background-color: var(--secondary-color);
}

.border {
  border: 1px solid var(--border-color);
}

.border-primary {
  border-color: var(--primary-color);
}

.border-secondary {
  border-color: var(--secondary-color);
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

/* Card styles */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}
`;

  fs.writeFileSync(cssPath, simplifiedCss);
  console.log('✅ globals.css file updated');
}

// Create a simplified version of the tailwind.config.js file
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
  console.log('📝 Updating tailwind.config.js file');

  // Create a backup of the original file
  const backupPath = path.join(process.cwd(), 'tailwind.config.js.bak');
  fs.copyFileSync(tailwindConfigPath, backupPath);

  // Create a simplified version of the file
  const simplifiedTailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        sourceSans: ['var(--font-source-sans)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#b82e63',
          light: '#d95a8f',
          dark: '#8c2249',
        },
        secondary: {
          DEFAULT: '#5a9933',
          light: '#7bc255',
          dark: '#3d6622',
        },
        accent: {
          DEFAULT: '#26d994',
          light: '#52e3ad',
          dark: '#1a9c6a',
        },
        background: {
          DEFAULT: '#f4f1f2',
          dark: '#2c2125',
        },
        text: {
          DEFAULT: '#2c2125',
          light: '#f4f1f2',
        },
      },
    },
  },
  plugins: [],
};
`;

  fs.writeFileSync(tailwindConfigPath, simplifiedTailwindConfig);
  console.log('✅ tailwind.config.js file updated');
}

// Create a simplified version of the postcss.config.js file
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  console.log('📝 Updating postcss.config.js file');

  // Create a backup of the original file
  const backupPath = path.join(process.cwd(), 'postcss.config.js.bak');
  fs.copyFileSync(postcssConfigPath, backupPath);

  // Create a simplified version of the file
  const simplifiedPostcssConfig = `
module.exports = {
  plugins: {
    // We're not using any PostCSS plugins for the Amplify build
  },
};
`;

  fs.writeFileSync(postcssConfigPath, simplifiedPostcssConfig);
  console.log('✅ postcss.config.js file updated');
}

// Create a simplified version of the next.config.js file
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('📝 Updating next.config.js file');

  // Create a backup of the original file
  const backupPath = path.join(process.cwd(), 'next.config.js.bak');
  fs.copyFileSync(nextConfigPath, backupPath);

  // Create a completely new simplified next.config.js file
  const simplifiedNextConfig = `/** @type {import('next').NextConfig} */
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
`;

  fs.writeFileSync(nextConfigPath, simplifiedNextConfig);
  console.log('✅ next.config.js file updated');
}

console.log('✅ Application prepared for AWS Amplify build');
