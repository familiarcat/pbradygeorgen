#!/bin/bash
# Script to run the complete PDF extraction process

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
  # Use the default PDF
  PDF_PATH="public/pbradygeorgen_resume.pdf"
  print_message "${YELLOW}" "INFO" "No PDF path provided, using default: ${PDF_PATH}"
else
  # Use the provided PDF path
  PDF_PATH="$1"
  print_message "${BLUE}" "INFO" "Using provided PDF: ${PDF_PATH}"
fi

# Check if the PDF file exists
if [ ! -f "$PDF_PATH" ]; then
  print_message "${RED}" "ERROR" "PDF file not found: ${PDF_PATH}"
  exit 1
fi

# Create the extracted directory if it doesn't exist
mkdir -p public/extracted

# Run the extraction scripts
print_message "${CYAN}" "PROCESS" "Starting PDF extraction process for ${PDF_PATH}"

# Extract text
print_message "${BLUE}" "TEXT" "Extracting text from PDF..."
node scripts/extract-pdf-text-improved.js "$PDF_PATH"

if [ $? -eq 0 ]; then
  print_message "${GREEN}" "SUCCESS" "Text extraction completed successfully"
else
  print_message "${RED}" "ERROR" "Text extraction failed"
  exit 1
fi

# Extract colors
print_message "${MAGENTA}" "COLOR" "Extracting colors from PDF..."
node scripts/extract-pdf-colors.js "$PDF_PATH"

if [ $? -eq 0 ]; then
  print_message "${GREEN}" "SUCCESS" "Color extraction completed successfully"
else
  print_message "${YELLOW}" "WARNING" "Color extraction failed, but continuing"
fi

# Extract fonts
print_message "${CYAN}" "FONT" "Extracting fonts from PDF..."
node scripts/extract-pdf-fonts.js "$PDF_PATH"

if [ $? -eq 0 ]; then
  print_message "${GREEN}" "SUCCESS" "Font extraction completed successfully"
else
  print_message "${YELLOW}" "WARNING" "Font extraction failed, but continuing"
fi

# Generate improved markdown
print_message "${BLUE}" "MARKDOWN" "Generating improved markdown..."
node scripts/generate-improved-markdown.js "public/extracted/resume_content.txt"

if [ $? -eq 0 ]; then
  print_message "${GREEN}" "SUCCESS" "Improved markdown generated successfully"
else
  print_message "${YELLOW}" "WARNING" "Markdown generation failed, but continuing"
fi

print_message "${GREEN}" "COMPLETE" "PDF extraction process completed successfully"
print_message "${BLUE}" "INFO" "Extracted files are available in public/extracted/"

# List the extracted files
echo ""
print_message "${CYAN}" "FILES" "Extracted files:"
ls -la public/extracted/

echo ""
print_message "${GREEN}" "NEXT" "You can now run 'npm run dev' to test the application with the extracted styles"
