#!/bin/bash
# Script to select a PDF file from the public folder for testing and deployment

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

# Print header
echo -e "\n${BOLD}${CYAN}=== PDF File Selection ===${NC}\n"
print_message "${BLUE}" "INFO" "This script will help you select a PDF file for testing and deployment"

# Step 1: Find all PDF files in the public folder and its subdirectories
print_message "${CYAN}" "STEP 1" "Finding PDF files in the public folder"

# Create an array to store the PDF files
pdf_files=()

# Find all PDF files in the public folder and its subdirectories
while IFS= read -r file; do
  pdf_files+=("$file")
done < <(find public -name "*.pdf" | sort)

# Also check source-pdfs directory if it exists
if [ -d "source-pdfs" ]; then
  while IFS= read -r file; do
    pdf_files+=("$file")
  done < <(find source-pdfs -name "*.pdf" | sort)
fi

# Check if any PDF files were found
if [ ${#pdf_files[@]} -eq 0 ]; then
  print_message "${RED}" "ERROR" "No PDF files found in the public folder or source-pdfs directory"
  exit 1
fi

# Step 2: Display the list of PDF files
print_message "${CYAN}" "STEP 2" "Displaying the list of PDF files"

echo -e "\nFound ${#pdf_files[@]} PDF files:\n"

for i in "${!pdf_files[@]}"; do
  echo -e "${BOLD}$((i+1)).${NC} ${pdf_files[$i]}"
done

# Step 3: Prompt the user to select a PDF file
print_message "${CYAN}" "STEP 3" "Selecting a PDF file"

echo -e "\nPlease select a PDF file by entering its number (1-${#pdf_files[@]}):"
read -p "> " selection

# Validate the selection
if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#pdf_files[@]} ]; then
  print_message "${RED}" "ERROR" "Invalid selection: $selection"
  exit 1
fi

# Get the selected PDF file
selected_pdf="${pdf_files[$((selection-1))]}"
print_message "${GREEN}" "SELECTED" "You selected: $selected_pdf"

# Step 4: Set the selected PDF as the default
print_message "${CYAN}" "STEP 4" "Setting the selected PDF as the default"

# Check if the set-default-pdf.sh script exists
if [ ! -f "scripts/set-default-pdf.sh" ]; then
  print_message "${RED}" "ERROR" "The set-default-pdf.sh script does not exist"
  exit 1
fi

# Run the set-default-pdf.sh script with the selected PDF
if ! run_command "./scripts/set-default-pdf.sh \"$selected_pdf\"" "Setting the selected PDF as the default"; then
  print_message "${RED}" "ERROR" "Failed to set the selected PDF as the default"
  exit 1
fi

# Step 5: Ask if the user wants to build and test the application
print_message "${CYAN}" "STEP 5" "Building and testing options"

echo -e "\nWhat would you like to do next?\n"
echo -e "${BOLD}1.${NC} Build and test locally"
echo -e "${BOLD}2.${NC} Build and simulate deployment to AWS"
echo -e "${BOLD}3.${NC} Exit"
read -p "> " action

case $action in
  1)
    print_message "${BLUE}" "ACTION" "Building and testing locally"
    
    # Build the application
    if ! run_command "npm run build" "Building the application"; then
      print_message "${RED}" "ERROR" "Build failed"
      exit 1
    fi
    
    # Start the application
    print_message "${BLUE}" "ACTION" "Starting the application"
    print_message "${BLUE}" "INFO" "The application will be available at http://localhost:3000"
    print_message "${BLUE}" "INFO" "Press Ctrl+C to stop the application"
    npm run start
    ;;
  2)
    print_message "${BLUE}" "ACTION" "Building and simulating deployment to AWS"
    
    # Run the deployment simulation
    if ! run_command "npm run deploy:simulate" "Simulating deployment to AWS"; then
      print_message "${RED}" "ERROR" "Deployment simulation failed"
      exit 1
    fi
    ;;
  3)
    print_message "${BLUE}" "ACTION" "Exiting"
    ;;
  *)
    print_message "${RED}" "ERROR" "Invalid selection: $action"
    exit 1
    ;;
esac

# Print success message
print_message "${GREEN}" "SUCCESS" "PDF selection process completed successfully"
