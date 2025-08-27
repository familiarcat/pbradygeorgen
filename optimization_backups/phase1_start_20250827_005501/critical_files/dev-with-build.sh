#!/bin/bash

# Check if node_modules/.next exists and is older than package.json or any config files
if [ ! -d "node_modules/.next" ] || \
   [ "$(find package.json next.config.js tsconfig.json -type f -newer node_modules/.next 2>/dev/null)" != "" ] || \
   [ "$(find types -type f -newer node_modules/.next 2>/dev/null)" != "" ]; then
  echo "🏗️ [Hesse] Changes detected in configuration or dependencies. Running build first..."
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ [Dante:Circle9] Build failed! Fix errors before continuing."
    exit 1
  fi
  echo "✅ [Hesse] Build completed successfully."
fi

# Run the development server
echo "🚀 [Salinger] Starting development server..."
npm run dev
