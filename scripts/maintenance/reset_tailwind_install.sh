#!/bin/bash

echo "🛠️ Chief O'Brien: Initiating Tailwind Recovery Protocol..."

# Navigate to project root
cd "$(dirname "$0")/../.." || exit 1

echo "♻️  Removing node_modules and lockfile..."
rm -rf node_modules package-lock.json

echo "🧹 Verifying and cleaning npm cache..."
npm cache verify

echo "📦 Reinstalling Tailwind and dependencies..."
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Check if binary is properly installed
if [ ! -f node_modules/.bin/tailwindcss ]; then
  echo "❌ tailwindcss binary not found after install."
  exit 1
fi

echo "✅ tailwindcss binary found."

echo "🧬 Initializing Tailwind config (TS + PostCSS)..."
npx tailwindcss init tailwind.config.ts -p

echo "✅ Tailwind recovery complete. Ready for Phase 3."
