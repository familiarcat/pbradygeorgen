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
rm -rf .next

# Install dependencies (like Amplify's npm ci)
echo "Installing dependencies..."
npm ci

# Ensure PDF content is extracted before build
echo "Checking PDF file..."
if [ -f "public/default_resume.pdf" ]; then
  echo "PDF file found: public/default_resume.pdf"
  echo "Last modified: $(stat -c %y public/default_resume.pdf 2>/dev/null || stat -f "%Sm" public/default_resume.pdf)"

  # Force refresh all extracted content
  echo "Force refreshing all extracted content..."
  ./force-refresh.sh

  if [ $? -eq 0 ]; then
    echo "PDF content extracted successfully"
  else
    echo "Error: PDF extraction failed"
    exit 1
  fi
else
  echo "Error: PDF file not found at public/default_resume.pdf"
  exit 1
fi

# Build the project
echo "Building the project..."
npm run build

# No need to copy static site marker for SSR deployment

# Serve the output (optional)
echo "Build completed. Run 'npm start' to serve the SSR application."
