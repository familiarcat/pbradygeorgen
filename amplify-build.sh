#!/bin/bash
# Custom build script for Amplify deployment

# Print environment information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Remove any existing backup folders
rm -rf amplify-backup || true
echo "Removed amplify-backup folder if it existed"

# Update the app ID in all relevant files
echo "Updating Amplify app ID in configuration files..."
find ./amplify -type f -name "*.json" -exec sed -i 's/d2gv0gd3awxys0/d3vvlp7umhc1qr/g' {} \;

# Install dependencies
echo "Installing dependencies..."
npm ci
npm install crypto-browserify stream-browserify buffer process

# Build the web app
echo "Building web app..."
npm run bundle:web

echo "Build completed successfully!"
