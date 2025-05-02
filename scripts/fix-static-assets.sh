#!/bin/bash
# fix-static-assets.sh - Fix static assets for standalone mode
# This script fixes 404 errors for static assets when running in standalone mode

set -e # Exit immediately if a command exits with a non-zero status

echo "🔧 FIXING STATIC ASSETS FOR STANDALONE MODE"
echo "=========================================="
echo "Timestamp: $(date)"

# Check if .next directory exists
if [ ! -d ".next" ]; then
  echo "❌ Error: .next directory not found. Run 'npm run build' first."
  exit 1
fi

# Check if standalone directory exists
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: .next/standalone directory not found. Run 'npm run build' first."
  exit 1
fi

# Create static directory in standalone
echo "📂 Creating static directory in standalone..."
mkdir -p .next/standalone/.next/static

# Copy static assets to standalone
echo "📂 Copying static assets to standalone..."
cp -R .next/static/* .next/standalone/.next/static/

# Copy public directory to standalone
echo "📂 Copying public directory to standalone..."
cp -R public .next/standalone/

echo "✅ Static assets fixed successfully!"
echo "You can now restart the application with 'npm run start'"
