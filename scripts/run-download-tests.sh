#!/bin/bash
# run-download-tests.sh - A script to run download functionality tests
# This script prepares the environment and runs the download tests

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 RUNNING DOWNLOAD FUNCTIONALITY TESTS"
echo "======================================"
echo "Test timestamp: $(date)"

# Create a directory for logs
LOG_DIR="$(pwd)/logs"
mkdir -p "$LOG_DIR"
TEST_LOG="$LOG_DIR/download-test-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log() {
  echo "$1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >>"$TEST_LOG"
}

# Step 1: Prepare the environment
log "🔧 Step 1: Preparing environment for download tests..."
node scripts/prepare-download-test.js >>"$TEST_LOG" 2>&1 || {
  log "❌ Failed to prepare environment for download tests."
  exit 1
}
log "✅ Environment prepared successfully"

# Step 2: Run the download tests
log "🧪 Step 2: Running download functionality tests..."
node scripts/test-download-functionality.js >>"$TEST_LOG" 2>&1 || {
  log "❌ Download functionality tests failed. See test report for details."
  exit 1
}
log "✅ Download functionality tests completed"

# Success message
log "🎉 Download tests completed successfully!"
log "Test log saved to: $TEST_LOG"

# Print a summary
echo ""
echo "📊 TEST SUMMARY"
echo "================"
echo "✅ Environment preparation: Completed"
echo "✅ Download tests: Completed"
echo ""
echo "Test log saved to: $TEST_LOG"

# Make the script executable
chmod +x "$(dirname "$0")/run-download-tests.sh"
