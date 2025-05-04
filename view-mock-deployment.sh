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
  if [ ! -f "amplify-job-mock.log" ]; then
    log_error "Mock deployment log not found."
    exit 1
  fi
  
  # Display the log file
  log_info "Deployment log:"
  echo ""
  
  # Read the log file line by line
  while IFS= read -r line; do
    # Extract the timestamp and message
    timestamp=$(echo "$line" | grep -o '\[.*\]' | head -1)
    message=$(echo "$line" | sed "s/$timestamp//")
    
    # Color-code the message based on its content
    if [[ "$message" == *"error"* ]] || [[ "$message" == *"Error"* ]] || [[ "$message" == *"ERROR"* ]]; then
      echo -e "${RED}${timestamp}${message}${NC}"
    elif [[ "$message" == *"warning"* ]] || [[ "$message" == *"Warning"* ]] || [[ "$message" == *"WARNING"* ]]; then
      echo -e "${YELLOW}${timestamp}${message}${NC}"
    elif [[ "$message" == *"success"* ]] || [[ "$message" == *"Success"* ]] || [[ "$message" == *"SUCCESS"* ]] || [[ "$message" == *"completed successfully"* ]]; then
      echo -e "${GREEN}${timestamp}${message}${NC}"
    else
      echo -e "${BLUE}${timestamp}${NC}${message}"
    fi
  done < "amplify-job-mock.log"
  
  echo ""
  log_success "Deployment completed successfully."
}

# Execute main function
main
