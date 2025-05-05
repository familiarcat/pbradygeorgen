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
if [ -f "public/pbradygeorgen_resume.pdf" ]; then
  echo "PDF file found: public/pbradygeorgen_resume.pdf"
  echo "Last modified: $(stat -c %y public/pbradygeorgen_resume.pdf 2>/dev/null || stat -f "%Sm" public/pbradygeorgen_resume.pdf)"

  # Create the extracted directory if it doesn't exist
  mkdir -p public/extracted

  # Extract content from the PDF
  echo "Extracting content from PDF..."
  node scripts/extract-pdf-text-improved.js public/pbradygeorgen_resume.pdf

  if [ $? -eq 0 ]; then
    echo "PDF content extracted successfully"
  else
    echo "Warning: PDF extraction failed, but continuing build"
  fi
else
  echo "Warning: PDF file not found at public/pbradygeorgen_resume.pdf"
fi

# Build the project
echo "Building the project..."
npm run build

# No need to copy static site marker for SSR deployment

# Serve the output (optional)
echo "Build completed. Run 'npm start' to serve the SSR application."
