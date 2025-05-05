#!/bin/bash
# Script to check Augment service status every minute using the Augment environment

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dante-inspired logging
log_info() {
  echo -e "👑🌊 [Dante:Purgatorio] ${BLUE}$1${NC}"
}

log_success() {
  echo -e "👑⭐ [Dante:Paradiso] ${GREEN}$1${NC}"
}

log_warning() {
  echo -e "👑🔥 [Dante:Inferno:Warning] ${YELLOW}$1${NC}"
}

log_error() {
  echo -e "👑🔥 [Dante:Inferno:Error] ${RED}$1${NC}"
}

# Function to check Augment service status
check_augment_status() {
  log_info "Checking Augment service status..."

  # Create a test file
  echo "Test file for Augment service check at $(date)" >augment_test.txt

  # Try to use the str-replace-editor tool to view the file
  if str-replace-editor view augment_test.txt &>/dev/null; then
    log_success "Augment service is up and running!"
    return 0
  else
    log_error "Augment service is not responding properly."
    return 1
  fi
}

# Main function to check status every minute for an hour
main() {
  log_info "Starting Augment service status check..."
  log_info "Will check every minute for the next hour or until service is up."

  # Set start time
  start_time=$(date +%s)
  end_time=$((start_time + 3600)) # 1 hour = 3600 seconds

  # Counter for attempts
  attempt=1

  # Loop until service is up or time limit is reached
  while [ $(date +%s) -lt $end_time ]; do
    log_info "Attempt $attempt at $(date)"

    if check_augment_status; then
      log_success "Augment service check successful after $attempt attempts!"
      exit 0
    fi

    # Wait for 60 seconds before next check
    log_warning "Waiting 60 seconds before next check..."
    sleep 60

    # Increment attempt counter
    attempt=$((attempt + 1))
  done

  log_error "Time limit reached. Augment service is still not responding properly after $((attempt - 1)) attempts."
  exit 1
}

# Execute main function
main
