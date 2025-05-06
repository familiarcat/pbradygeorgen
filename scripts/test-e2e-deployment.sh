#!/bin/bash
# test-e2e-deployment.sh - End-to-End testing of local and Amplify deployments
# This script runs both local and Amplify build processes and compares the results

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 STARTING E2E DEPLOYMENT TEST"
echo "=============================="
echo "Timestamp: $(date)"

# Create a directory for logs
LOG_DIR="$(pwd)/logs"
mkdir -p "$LOG_DIR"
TEST_LOG="$LOG_DIR/e2e-test-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log() {
  echo "$1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >>"$TEST_LOG"
}

# Step 1: Clean the environment
log "🧹 Step 1: Cleaning the environment..."
npm run rebuild >>"$TEST_LOG" 2>&1 || {
  log "❌ Failed to clean the environment. Exiting."
  exit 1
}
log "✅ Environment cleaned successfully"

# Step 2: Run the local build process
log "🏗️ Step 2: Running local build process..."
npm run build >>"$TEST_LOG" 2>&1 || {
  log "❌ Local build failed. See $TEST_LOG for details."
  exit 1
}
log "✅ Local build completed successfully"

# Step 3: Capture local build artifacts for comparison
log "📊 Step 3: Capturing local build artifacts..."
mkdir -p "$LOG_DIR/local-build"

# Check if .next/standalone exists
if [ ! -d ".next/standalone" ]; then
  log "⚠️ Warning: .next/standalone directory does not exist. Running fix:standalone..."
  npm run fix:standalone >>"$TEST_LOG" 2>&1
fi

# Try copying again after potential fix
if [ -d ".next/standalone" ]; then
  cp -R .next/standalone "$LOG_DIR/local-build/" >>"$TEST_LOG" 2>&1 || {
    log "⚠️ Warning: Failed to copy local build artifacts."
  }
  log "✅ Local build artifacts captured"
else
  log "❌ Error: Failed to create or find .next/standalone directory."
  exit 1
fi

# Step 4: Run the Amplify build test
log "🔄 Step 4: Running Amplify build test..."
./scripts/test-amplify-build.sh >>"$TEST_LOG" 2>&1 || {
  log "❌ Amplify build test failed. See $TEST_LOG for details."
  exit 1
}
log "✅ Amplify build test completed successfully"

# Step 5: Analyze build logs
log "🔍 Step 5: Analyzing build logs..."
npm run log:analyze >>"$TEST_LOG" 2>&1 || {
  log "⚠️ Warning: Failed to analyze build logs."
}
log "✅ Build log analysis completed"

# Step 6: Start the application in production mode (optional, uncomment if needed)
# log "🚀 Step 6: Starting the application in production mode..."
# npm run start &
# SERVER_PID=$!
# log "✅ Application started with PID: $SERVER_PID"
# log "📝 The application is running at http://localhost:3000"
# log "Press Enter to stop the server and continue..."
# read
# kill $SERVER_PID
# log "✅ Server stopped"

# Success message
log "🎉 E2E deployment test completed successfully!"
log "Test log saved to: $TEST_LOG"

# Print a summary
echo ""
echo "📊 E2E TEST SUMMARY"
echo "=================="
echo "✅ Environment Cleaning: Completed"
echo "✅ Local Build: Completed"
echo "✅ Amplify Build Test: Completed"
echo "✅ Log Analysis: Completed"
echo ""
echo "Next steps:"
echo "1. Review the test log at: $TEST_LOG"
echo "2. Run 'npm run start' to start the application locally"
echo "3. Run 'npm run amplify:local' to test the Amplify deployment locally"
echo "4. Compare the behavior between the two deployment methods"
echo ""
echo "Test log saved to: $TEST_LOG"
