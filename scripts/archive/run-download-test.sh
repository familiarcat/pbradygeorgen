#!/bin/bash
# Script to run the download test page
# Following Salinger's philosophy of transparency, this script ensures all information is accessible

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
  log_info "Starting download test..."
  
  # Check if the PDF file exists
  if [ ! -f "public/default_resume.pdf" ] && [ ! -f "public/pbradygeorgen_resume.pdf" ]; then
    log_error "No PDF files found. Please add a PDF file to the public directory."
    exit 1
  fi
  
  # Run the PDF reference manager
  log_info "Running PDF reference manager..."
  node scripts/manage-pdf-references.js
  
  if [ $? -ne 0 ]; then
    log_error "PDF reference manager failed."
    exit 1
  fi
  
  # Check if the download test page exists
  if [ ! -d "app/download-test" ]; then
    log_error "Download test page not found."
    exit 1
  fi
  
  # Start the development server
  log_info "Starting development server..."
  log_info "Once the server is running, open http://localhost:3000/download-test in your browser."
  log_info "Press Ctrl+C to stop the server."
  
  npm run dev
}

# Execute main function
main
