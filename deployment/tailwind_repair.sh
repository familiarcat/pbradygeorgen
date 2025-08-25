#!/bin/bash

echo "🛠️ Chief O'Brien: Beginning Tailwind Recovery Protocol..."

# Step 1: Clean the environment
echo "🧹 Cleaning old Node modules and lockfiles..."
rm -rf node_modules package-lock.json .npm
npm cache clean --force

# Step 2: Install TailwindCSS
echo "📦 Installing TailwindCSS latest..."
npm install -D tailwindcss@latest postcss autoprefixer

# Step 3: Verify installation
if [ -f node_modules/.bin/tailwindcss ]; then
  echo "✅ Tailwind binary found."
else
  echo "⚠️ Tailwind binary not found in .bin. Attempting manual link..."
  if [ -f node_modules/tailwindcss/lib/cli.js ]; then
    ln -s ../tailwindcss/lib/cli.js node_modules/.bin/tailwindcss
    chmod +x node_modules/.bin/tailwindcss
    echo "🔗 Binary symlink created."
  else
    echo "❌ Tailwind CLI not found in expected location. Aborting."
    exit 1
  fi
fi

# Step 4: Initialize Tailwind config
echo "🧬 Initializing Tailwind configuration..."
npx tailwindcss init tailwind.config.ts -p

echo "🚀 Tailwind recovery complete. Ready for warp."
