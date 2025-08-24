#!/bin/bash
# 🛠️ Tailwind + PostCSS Repair Script
# Ensures proper setup of Tailwind CSS with updated PostCSS plugin structure

set -e

echo "🛠️ Repairing Tailwind + PostCSS Integration..."

# Ensure tailwindcss and supporting plugins are installed
echo "📦 Installing Tailwind and updated PostCSS plugin..."
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss

# Generate Tailwind and PostCSS config if missing
if [ ! -f tailwind.config.js ]; then
  echo "📄 Generating tailwind.config.js..."
  npx tailwindcss init
fi

if [ ! -f postcss.config.js ]; then
  echo "📄 Creating postcss.config.js..."
  cat <<EOT > postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOT
else
  echo "✅ Found existing postcss.config.js. Please manually verify it includes '@tailwindcss/postcss'."
fi

echo "✅ Tailwind and PostCSS setup repaired. You may now re-run 'npm run build'."
