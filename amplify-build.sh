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

# Copy static HTML files to ensure fallbacks are available
echo "Copying static HTML files..."
mkdir -p dist
cp -f public/index.html dist/index.html
cp -f static/fallback.html dist/fallback.html

# Copy redirects file
echo "Copying redirects file..."
cp -f redirects.json dist/redirects.json

# Build the web app
echo "Building web app..."
npm run bundle:web

# Ensure the index.html file exists in the dist folder
if [ ! -f dist/index.html ]; then
  echo "Warning: index.html not found in dist folder, copying from public folder"
  cp -f public/index.html dist/index.html
fi

echo "Build completed successfully!"
