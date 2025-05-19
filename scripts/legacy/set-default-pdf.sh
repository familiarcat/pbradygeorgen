#!/bin/bash
# Script to set a new PDF as the default and process it

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  local color=$1
  local prefix=$2
  local message=$3
  echo -e "${color}${BOLD}[${prefix}]${NC} ${message}"
}

# Check if a PDF path was provided
if [ $# -eq 0 ]; then
  print_message "${RED}" "ERROR" "No PDF path provided"
  print_message "${BLUE}" "USAGE" "./scripts/set-default-pdf.sh path/to/your/pdf"
  exit 1
fi

# Get the PDF path
PDF_PATH="$1"

# Check if the PDF file exists
if [ ! -f "$PDF_PATH" ]; then
  print_message "${RED}" "ERROR" "PDF file not found: ${PDF_PATH}"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p public/backup

# Backup the current default PDF if it exists
DEFAULT_PDF="public/pbradygeorgen_resume.pdf"
if [ -f "$DEFAULT_PDF" ]; then
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  BACKUP_PATH="public/backup/pbradygeorgen_resume_${TIMESTAMP}.pdf"
  print_message "${BLUE}" "BACKUP" "Backing up current default PDF to ${BACKUP_PATH}"
  cp "$DEFAULT_PDF" "$BACKUP_PATH"
fi

# Copy the new PDF to the default location
print_message "${BLUE}" "COPY" "Setting new PDF as default: ${PDF_PATH} -> ${DEFAULT_PDF}"
cp "$PDF_PATH" "$DEFAULT_PDF"

# Process the new PDF
print_message "${CYAN}" "PROCESS" "Processing the new default PDF"
./scripts/extract-pdf-all.sh "$DEFAULT_PDF"

# Print success message
print_message "${GREEN}" "SUCCESS" "New default PDF set and processed successfully"
print_message "${BLUE}" "NEXT" "You can now run 'npm run dev' to test the application with the new PDF"
