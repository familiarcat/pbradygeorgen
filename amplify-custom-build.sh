#!/bin/bash
# Custom build script for AWS Amplify based on successful React Native deployment

echo "Starting custom build script for AWS Amplify"

# Print current environment
echo "Current directory: $(pwd)"
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Create .npmrc file to ignore engine requirements
echo "Creating .npmrc file"
echo "engine-strict=false" > .npmrc
echo "ignore-engines=true" >> .npmrc
cat .npmrc

# Clean up package.json and package-lock.json
echo "Cleaning up package.json and package-lock.json"
rm -f package-lock.json
node cleanup-package.js
cat package.json

# Install dependencies with legacy peer deps and no package lock
echo "Installing dependencies"
npm install --legacy-peer-deps --no-package-lock

# Build the application
echo "Building the application"
export NODE_OPTIONS=--max_old_space_size=4096
NODE_ENV=production npm run build

# Create a dist directory similar to React Native build
echo "Creating dist directory"
mkdir -p dist
cp -r .next dist/
cp -r public dist/
cp next.config.js dist/
cp package.json dist/

# List the contents of the dist directory
echo "Contents of dist directory:"
ls -la dist/

echo "Build completed successfully!"
exit 0
