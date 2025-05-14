#!/bin/bash
# Script to deploy the application to AWS Amplify

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

# Print deployment header
echo -e "\n${BOLD}${CYAN}=== AWS Amplify Deployment ===${NC}\n"
print_message "${BLUE}" "INFO" "This script will deploy the application to AWS Amplify"

# Step 1: Check if AWS CLI is installed
print_message "${CYAN}" "STEP 1" "Checking if AWS CLI is installed"

if ! command -v aws &> /dev/null; then
  print_message "${RED}" "ERROR" "AWS CLI is not installed"
  print_message "${BLUE}" "INFO" "Please install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
  exit 1
fi

# Step 2: Check if AWS credentials are configured
print_message "${CYAN}" "STEP 2" "Checking if AWS credentials are configured"

if ! aws sts get-caller-identity &> /dev/null; then
  print_message "${RED}" "ERROR" "AWS credentials are not configured"
  print_message "${BLUE}" "INFO" "Please configure AWS credentials: aws configure"
  exit 1
fi

# Step 3: Run tests
print_message "${CYAN}" "STEP 3" "Running tests"

if ! run_command "npm run test:pdf-extraction" "Testing PDF extraction"; then
  print_message "${RED}" "ERROR" "Tests failed"
  print_message "${YELLOW}" "WARNING" "Deployment aborted due to test failures"
  exit 1
fi

# Step 4: Build the application
print_message "${CYAN}" "STEP 4" "Building the application"

if ! run_command "npm run build" "Building the application"; then
  print_message "${RED}" "ERROR" "Build failed"
  print_message "${YELLOW}" "WARNING" "Deployment aborted due to build failures"
  exit 1
fi

# Step 5: Deploy to AWS Amplify
print_message "${CYAN}" "STEP 5" "Deploying to AWS Amplify"

# Get the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_message "${BLUE}" "INFO" "Current branch: ${CURRENT_BRANCH}"

# Check if the branch exists in the remote
if ! git ls-remote --heads origin ${CURRENT_BRANCH} | grep ${CURRENT_BRANCH} > /dev/null; then
  print_message "${YELLOW}" "WARNING" "Branch ${CURRENT_BRANCH} does not exist in the remote"
  
  # Ask if the user wants to push the branch
  read -p "Do you want to push the branch to the remote? (y/n) " -n 1 -r
  echo
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! run_command "git push -u origin ${CURRENT_BRANCH}" "Pushing branch to remote"; then
      print_message "${RED}" "ERROR" "Failed to push branch to remote"
      exit 1
    fi
  else
    print_message "${YELLOW}" "WARNING" "Deployment aborted"
    exit 1
  fi
fi

# Deploy using AWS Amplify CLI
if ! run_command "aws amplify start-job --app-id YOUR_AMPLIFY_APP_ID --branch-name ${CURRENT_BRANCH} --job-type RELEASE" "Starting Amplify deployment job"; then
  print_message "${RED}" "ERROR" "Failed to start Amplify deployment job"
  exit 1
fi

# Print success message
print_message "${GREEN}" "SUCCESS" "Deployment initiated successfully"
print_message "${BLUE}" "INFO" "You can check the deployment status in the AWS Amplify Console"
print_message "${BLUE}" "INFO" "https://console.aws.amazon.com/amplify/home"
