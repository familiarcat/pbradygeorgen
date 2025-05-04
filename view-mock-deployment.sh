#!/bin/bash
# Script to view the mock deployment log

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

# Main function
main() {
  log_info "Viewing mock deployment log..."

  # Check if the log file exists
  if [ ! -f "amplify-deployment-mock.log" ]; then
    log_error "Mock deployment log not found."
    exit 1
  fi

  # Display the log file
  log_info "Deployment log:"
  echo ""

  # Read the log file line by line
  while IFS= read -r line; do
    # Extract the timestamp and message
    timestamp=$(echo "$line" | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}.[0-9]\{3\}Z' || echo "")
    level=$(echo "$line" | grep -o '\[INFO\]\|\[WARNING\]\|\[ERROR\]' || echo "")
    message=$(echo "$line" | sed "s/$timestamp//g" | sed "s/$level//g")

    # Color-code the message based on its level
    if [[ "$level" == "[ERROR]" ]]; then
      echo -e "${RED}${timestamp} ${level}${message}${NC}"
    elif [[ "$level" == "[WARNING]" ]]; then
      echo -e "${YELLOW}${timestamp} ${level}${message}${NC}"
    elif [[ "$line" == *"success"* ]] || [[ "$line" == *"Success"* ]] || [[ "$line" == *"SUCCESS"* ]] || [[ "$line" == *"completed successfully"* ]]; then
      echo -e "${GREEN}${timestamp} ${level}${message}${NC}"
    else
      echo -e "${BLUE}${timestamp} ${level}${NC}${message}"
    fi
  done <"amplify-deployment-mock.log"

  echo ""
  log_success "Deployment completed successfully."
}

# Execute main function
main
