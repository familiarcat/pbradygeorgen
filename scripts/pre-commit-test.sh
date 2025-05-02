#!/bin/bash
# pre-commit-test.sh - Run tests before committing code
# This script can be used as a git pre-commit hook or run manually

set -e # Exit immediately if a command exits with a non-zero status

echo "🧪 Running pre-commit tests"
echo "=========================="

# Create a directory for test results
TEST_RESULTS_DIR="$(pwd)/test-results"
mkdir -p "$TEST_RESULTS_DIR"

# Save current date and time
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$TEST_RESULTS_DIR/pre-commit-test-$TIMESTAMP.log"

# Function to log messages
log() {
  echo "$1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> "$LOG_FILE"
}

# Function to run a test and check its exit code
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  log "Running test: $test_name"
  
  if eval "$test_command" >> "$LOG_FILE" 2>&1; then
    log "✅ $test_name passed"
    return 0
  else
    log "❌ $test_name failed"
    return 1
  fi
}

# Check if we're in a git repository
if [ ! -d .git ] && [ -z "$SKIP_GIT_CHECK" ]; then
  log "Error: Not in a git repository. Run this script from the root of your project."
  exit 1
fi

# 1. Run linting
log "Running linting..."
if run_test "Linting" "npm run lint"; then
  log "Linting passed"
else
  log "Linting failed. Fix the issues before committing."
  exit 1
fi

# 2. Run download functionality tests
log "Running download functionality tests..."
if run_test "Download functionality tests" "node scripts/test-download-functionality.js"; then
  log "Download functionality tests passed"
else
  log "Download functionality tests failed. Fix the issues before committing."
  exit 1
fi

# 3. Check if the application builds successfully
log "Checking if the application builds successfully..."
if run_test "Build check" "npm run build:local"; then
  log "Build check passed"
else
  log "Build check failed. Fix the issues before committing."
  exit 1
fi

# All tests passed
log "🎉 All tests passed! You can commit your changes."
exit 0
