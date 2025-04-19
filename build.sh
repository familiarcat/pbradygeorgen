#!/bin/bash
# build.sh - Simulate Amplify build process locally

echo "Node version $(node -v)"
echo "NPM version $(npm -v)"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf out
rm -rf .next

# Install dependencies (like Amplify's npm ci)
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building the project..."
npm run build

# Serve the output (optional)
echo "Build completed. Run 'npm start' to serve the static site."
