#!/bin/bash
# debug-build.sh - Debug build issues

# Print current environment
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Check TypeScript compilation
echo "Checking TypeScript compilation..."
npx tsc --noEmit

# Check ESLint
echo "Checking ESLint..."
npm run lint

# Try building with more verbose output
echo "Running Next.js build with verbose output..."
NODE_OPTIONS="--trace-warnings" next build

echo "Build debug completed."
