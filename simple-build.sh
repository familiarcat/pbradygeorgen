#!/bin/bash
# simple-build.sh - Simplified build script

# Print current environment
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next

# Build the project
echo "Building the project..."
npx next build

echo "Build completed."
