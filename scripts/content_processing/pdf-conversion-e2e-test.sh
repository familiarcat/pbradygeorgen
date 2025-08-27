#!/bin/bash
# E2E Test Script for PDF Conversion

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

# Function to check if a file exists
check_file() {
  local file_path=$1
  local file_name=$(basename "$file_path")
  
  if [ -f "$file_path" ]; then
    print_message "${GREEN}" "CHECK" "✓ $file_name exists"
    return 0
  else
    print_message "${RED}" "CHECK" "✗ $file_name does not exist"
    return 1
  fi
}

# Function to run a command and check its exit status
run_command() {
  local command=$1
  local description=$2
  
  print_message "${BLUE}" "RUN" "$description"
  echo "$ $command"
  
  eval $command
  local exit_code=$?
  
  if [ $exit_code -eq 0 ]; then
    print_message "${GREEN}" "SUCCESS" "Command completed successfully"
    return 0
  else
    print_message "${RED}" "ERROR" "Command failed with exit code $exit_code"
    return 1
  fi
}

# Print test header
echo -e "\n${BOLD}${CYAN}=== PDF Conversion E2E Test ===${NC}\n"
print_message "${BLUE}" "INFO" "This test will verify the entire PDF conversion pipeline"

# Step 1: Check if the default PDF exists
print_message "${CYAN}" "STEP 1" "Checking if the default PDF exists"
DEFAULT_PDF="public/pbradygeorgen_resume.pdf"

if ! check_file "$DEFAULT_PDF"; then
  print_message "${YELLOW}" "WARNING" "Default PDF not found, using resume_redesign.pdf"
  
  # Check if resume_redesign.pdf exists
  if [ -f "public/resume_redesign.pdf" ]; then
    print_message "${BLUE}" "INFO" "Copying resume_redesign.pdf to $DEFAULT_PDF"
    cp "public/resume_redesign.pdf" "$DEFAULT_PDF"
    
    if [ $? -ne 0 ]; then
      print_message "${RED}" "ERROR" "Failed to copy PDF file"
      exit 1
    fi
  else
    print_message "${RED}" "ERROR" "No PDF file found to use for testing"
    exit 1
  fi
fi

# Step 2: Run the PDF extraction process
print_message "${CYAN}" "STEP 2" "Running PDF extraction process"

if ! run_command "npm run pdf:extract:default" "Extracting content from default PDF"; then
  print_message "${RED}" "ERROR" "PDF extraction failed"
  exit 1
fi

# Step 3: Verify the extracted files
print_message "${CYAN}" "STEP 3" "Verifying extracted files"

EXTRACTED_DIR="public/extracted"
FILES_TO_CHECK=(
  "$EXTRACTED_DIR/resume_content.txt"
  "$EXTRACTED_DIR/resume_content.md"
  "$EXTRACTED_DIR/color_theory.json"
  "$EXTRACTED_DIR/font_theory.json"
)

all_files_exist=true
for file in "${FILES_TO_CHECK[@]}"; do
  if ! check_file "$file"; then
    all_files_exist=false
  fi
done

if [ "$all_files_exist" = false ]; then
  print_message "${RED}" "ERROR" "Some extracted files are missing"
  exit 1
fi

# Step 4: Check the content of the extracted files
print_message "${CYAN}" "STEP 4" "Checking content of extracted files"

# Check if color_theory.json is valid JSON
if ! run_command "cat $EXTRACTED_DIR/color_theory.json | jq ." "Validating color_theory.json"; then
  print_message "${YELLOW}" "WARNING" "color_theory.json is not valid JSON or jq is not installed"
fi

# Check if font_theory.json is valid JSON
if ! run_command "cat $EXTRACTED_DIR/font_theory.json | jq ." "Validating font_theory.json"; then
  print_message "${YELLOW}" "WARNING" "font_theory.json is not valid JSON or jq is not installed"
fi

# Step 5: Build the application
print_message "${CYAN}" "STEP 5" "Building the application"

if ! run_command "npm run build" "Building the application"; then
  print_message "${RED}" "ERROR" "Build failed"
  exit 1
fi

# Step 6: Start the application in the background
print_message "${CYAN}" "STEP 6" "Starting the application"

print_message "${BLUE}" "INFO" "Starting the application in the background"
npm run start > app.log 2>&1 &
APP_PID=$!

# Wait for the application to start
print_message "${BLUE}" "INFO" "Waiting for the application to start (10 seconds)"
sleep 10

# Check if the application is running
if ! ps -p $APP_PID > /dev/null; then
  print_message "${RED}" "ERROR" "Application failed to start"
  cat app.log
  exit 1
fi

print_message "${GREEN}" "SUCCESS" "Application started successfully (PID: $APP_PID)"

# Step 7: Test the PDF styling demo page
print_message "${CYAN}" "STEP 7" "Testing the PDF styling demo page"

print_message "${BLUE}" "INFO" "Opening the PDF styling demo page in the browser"
if command -v open > /dev/null; then
  # macOS
  open "http://localhost:3000/pdf-styling-demo"
elif command -v xdg-open > /dev/null; then
  # Linux
  xdg-open "http://localhost:3000/pdf-styling-demo"
elif command -v start > /dev/null; then
  # Windows
  start "http://localhost:3000/pdf-styling-demo"
else
  print_message "${YELLOW}" "WARNING" "Could not open browser automatically"
  print_message "${BLUE}" "INFO" "Please open http://localhost:3000/pdf-styling-demo in your browser"
fi

# Step 8: Manual verification
print_message "${CYAN}" "STEP 8" "Manual verification"

print_message "${BLUE}" "INFO" "Please verify the following in the browser:"
echo "1. The page loads without errors"
echo "2. The colors and fonts are applied correctly"
echo "3. The cascading animation works as expected"
echo "4. The components are styled according to the PDF"

# Wait for user confirmation
read -p "Press Enter when you have completed the verification..."

# Step 9: Clean up
print_message "${CYAN}" "STEP 9" "Cleaning up"

print_message "${BLUE}" "INFO" "Stopping the application"
kill $APP_PID

print_message "${GREEN}" "SUCCESS" "E2E test completed successfully"
