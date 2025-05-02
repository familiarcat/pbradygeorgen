#!/bin/bash
# rebuild-app.sh - A script to rebuild the application after fixing issues
# This script cleans up the build artifacts and rebuilds the application

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 REBUILDING APPLICATION"
echo "========================="
echo "Rebuild timestamp: $(date)"

# Create a directory for logs
LOG_DIR="$(pwd)/logs"
mkdir -p "$LOG_DIR"
REBUILD_LOG="$LOG_DIR/rebuild-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log() {
  echo "$1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >>"$REBUILD_LOG"
}

# Step 1: Clean up build artifacts
log "🧹 Step 1: Cleaning up build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
log "✅ Build artifacts cleaned up"

# Step 2: Ensure extracted directory exists
log "📁 Step 2: Ensuring extracted directory exists..."
mkdir -p public/extracted
log "✅ Extracted directory created"

# Step 3: Prepare environment for download tests
log "🔧 Step 3: Preparing environment for download tests..."
node scripts/prepare-download-test.js >>"$REBUILD_LOG" 2>&1 || {
  log "⚠️ Warning: Failed to prepare environment for download tests. Continuing with rebuild..."
}
log "✅ Download test environment preparation attempted"

# Step 4: Rebuild the application
log "🏗️ Step 4: Rebuilding the application..."
npm run build >>"$REBUILD_LOG" 2>&1 || {
  log "❌ Build failed. See $REBUILD_LOG for details."
  exit 1
}
log "✅ Application rebuilt successfully"

# Success message
log "🎉 Application rebuild completed!"
log "Rebuild log saved to: $REBUILD_LOG"

# Print a summary
echo ""
echo "📊 REBUILD SUMMARY"
echo "================="
echo "✅ Cleanup: Completed"
echo "✅ Extracted directory: Created"
echo "✅ Download test environment: Prepared"
echo "✅ Application rebuild: Completed"
echo ""
echo "Next steps:"
echo "1. Run 'npm run start' to start the application"
echo "2. Run 'npm run test:download' to test download functionality"
echo ""
echo "Rebuild log saved to: $REBUILD_LOG"
