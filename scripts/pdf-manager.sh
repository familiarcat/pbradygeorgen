#!/bin/bash
# PDF Manager - A unified script for managing PDF files in AlexAI
#
# This script provides a unified interface for all PDF-related functionality:
# - Selecting a PDF file
# - Extracting content from a PDF
# - Testing PDF extraction
# - Building and testing the application
# - Deploying to AWS
#
# Philosophical Framework:
# - Salinger: Intuitive user interaction
# - Dante: Methodical logging of the process
# - Hesse: Mathematical precision in extraction
# - Derrida: Deconstructing the PDF into its core elements

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

# Function to display the main menu
display_main_menu() {
  echo -e "\n${BOLD}${CYAN}=== AlexAI PDF Manager ===${NC}\n"
  echo -e "Welcome to the AlexAI PDF Manager. This tool helps you manage PDF files in the application."
  echo -e "Please select an option:\n"
  echo -e "${BOLD}1.${NC} Select a PDF file"
  echo -e "${BOLD}2.${NC} Extract content from the current PDF"
  echo -e "${BOLD}3.${NC} Test PDF extraction"
  echo -e "${BOLD}4.${NC} Build and test locally"
  echo -e "${BOLD}5.${NC} Simulate deployment to AWS"
  echo -e "${BOLD}6.${NC} Deploy to AWS"
  echo -e "${BOLD}7.${NC} Exit"
  echo -e "\nCurrent default PDF: ${YELLOW}$(get_current_pdf)${NC}\n"
  read -p "Enter your choice (1-7): " choice
  
  case $choice in
    1) select_pdf ;;
    2) extract_pdf ;;
    3) test_pdf_extraction ;;
    4) build_and_test ;;
    5) simulate_deployment ;;
    6) deploy_to_aws ;;
    7) exit_manager ;;
    *) 
      print_message "${RED}" "ERROR" "Invalid choice: $choice"
      display_main_menu
      ;;
  esac
}

# Function to get the current default PDF
get_current_pdf() {
  if [ -f "public/pbradygeorgen_resume.pdf" ]; then
    # Try to get the original filename from the backup directory
    local latest_backup=$(ls -t public/backup/pbradygeorgen_resume_*.pdf 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
      echo "public/pbradygeorgen_resume.pdf (from $latest_backup)"
    else
      echo "public/pbradygeorgen_resume.pdf"
    fi
  else
    echo "No default PDF set"
  fi
}

# Function to select a PDF file
select_pdf() {
  print_message "${CYAN}" "OPTION" "Selecting a PDF file"
  
  # Find all PDF files in the public folder and its subdirectories
  pdf_files=()
  
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
    display_main_menu
    return
  fi
  
  # Display the list of PDF files
  echo -e "\nFound ${#pdf_files[@]} PDF files:\n"
  
  for i in "${!pdf_files[@]}"; do
    echo -e "${BOLD}$((i+1)).${NC} ${pdf_files[$i]}"
  done
  
  # Prompt the user to select a PDF file
  echo -e "\nPlease select a PDF file by entering its number (1-${#pdf_files[@]}):"
  read -p "> " selection
  
  # Validate the selection
  if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#pdf_files[@]} ]; then
    print_message "${RED}" "ERROR" "Invalid selection: $selection"
    display_main_menu
    return
  fi
  
  # Get the selected PDF file
  selected_pdf="${pdf_files[$((selection-1))]}"
  print_message "${GREEN}" "SELECTED" "You selected: $selected_pdf"
  
  # Set the selected PDF as the default
  if ! run_command "./scripts/set-default-pdf.sh \"$selected_pdf\"" "Setting the selected PDF as the default"; then
    print_message "${RED}" "ERROR" "Failed to set the selected PDF as the default"
    display_main_menu
    return
  fi
  
  display_main_menu
}

# Function to extract content from the current PDF
extract_pdf() {
  print_message "${CYAN}" "OPTION" "Extracting content from the current PDF"
  
  # Check if the default PDF exists
  if [ ! -f "public/pbradygeorgen_resume.pdf" ]; then
    print_message "${RED}" "ERROR" "No default PDF set. Please select a PDF file first."
    display_main_menu
    return
  fi
  
  # Extract content from the PDF
  if ! run_command "npm run pdf:extract:default" "Extracting content from the default PDF"; then
    print_message "${RED}" "ERROR" "Failed to extract content from the PDF"
    display_main_menu
    return
  fi
  
  display_main_menu
}

# Function to test PDF extraction
test_pdf_extraction() {
  print_message "${CYAN}" "OPTION" "Testing PDF extraction"
  
  # Run the PDF extraction test
  if ! run_command "npm run test:pdf-extraction" "Testing PDF extraction"; then
    print_message "${RED}" "ERROR" "PDF extraction test failed"
    display_main_menu
    return
  fi
  
  display_main_menu
}

# Function to build and test locally
build_and_test() {
  print_message "${CYAN}" "OPTION" "Building and testing locally"
  
  # Build the application
  if ! run_command "npm run build" "Building the application"; then
    print_message "${RED}" "ERROR" "Build failed"
    display_main_menu
    return
  fi
  
  # Ask if the user wants to start the application
  echo -e "\nDo you want to start the application? (y/n)"
  read -p "> " start_app
  
  if [[ $start_app =~ ^[Yy]$ ]]; then
    # Start the application
    print_message "${BLUE}" "ACTION" "Starting the application"
    print_message "${BLUE}" "INFO" "The application will be available at http://localhost:3000"
    print_message "${BLUE}" "INFO" "Press Ctrl+C to stop the application and return to the menu"
    npm run start
  fi
  
  display_main_menu
}

# Function to simulate deployment to AWS
simulate_deployment() {
  print_message "${CYAN}" "OPTION" "Simulating deployment to AWS"
  
  # Run the deployment simulation
  if ! run_command "npm run deploy:simulate" "Simulating deployment to AWS"; then
    print_message "${RED}" "ERROR" "Deployment simulation failed"
    display_main_menu
    return
  fi
  
  display_main_menu
}

# Function to deploy to AWS
deploy_to_aws() {
  print_message "${CYAN}" "OPTION" "Deploying to AWS"
  
  # Run the deployment script
  if ! run_command "npm run deploy:aws" "Deploying to AWS"; then
    print_message "${RED}" "ERROR" "Deployment failed"
    display_main_menu
    return
  fi
  
  display_main_menu
}

# Function to exit the manager
exit_manager() {
  print_message "${CYAN}" "OPTION" "Exiting the PDF Manager"
  print_message "${GREEN}" "GOODBYE" "Thank you for using the AlexAI PDF Manager"
  exit 0
}

# Display the main menu
display_main_menu
