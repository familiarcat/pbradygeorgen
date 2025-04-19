#!/bin/bash
# build.sh - Simulate Amplify build process locally

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ $NODE_MAJOR -lt 18 ]; then
  echo "Error: Node.js version 18 or higher is required. Current version: $NODE_VERSION"
  echo "Please upgrade Node.js or use nvm to switch to a compatible version."
  exit 1
fi

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
