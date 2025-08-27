#!/bin/bash
# Script to simulate AWS Amplify deployment

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
echo -e "\n${BOLD}${CYAN}=== AWS Amplify Deployment Simulation ===${NC}\n"
print_message "${BLUE}" "INFO" "This script will simulate the AWS Amplify deployment process"

# Step 1: Run tests
print_message "${CYAN}" "STEP 1" "Running tests"

if ! run_command "npm run test:pdf-extraction" "Testing PDF extraction"; then
  print_message "${RED}" "ERROR" "Tests failed"
  print_message "${YELLOW}" "WARNING" "Deployment aborted due to test failures"
  exit 1
fi

# Step 2: Build the application
print_message "${CYAN}" "STEP 2" "Building the application"

if ! run_command "npm run build" "Building the application"; then
  print_message "${RED}" "ERROR" "Build failed"
  print_message "${YELLOW}" "WARNING" "Deployment aborted due to build failures"
  exit 1
fi

# Step 3: Simulate AWS Amplify build process
print_message "${CYAN}" "STEP 3" "Simulating AWS Amplify build process"

# Create a temporary directory for the build
BUILD_DIR="amplify-build-simulation"
if ! run_command "mkdir -p ${BUILD_DIR}" "Creating build directory"; then
  print_message "${RED}" "ERROR" "Failed to create build directory"
  exit 1
fi

# Copy the build files to the simulation directory
if ! run_command "cp -r .next ${BUILD_DIR}/" "Copying build files"; then
  print_message "${RED}" "ERROR" "Failed to copy build files"
  exit 1
fi

# Copy the public directory to the simulation directory
if ! run_command "cp -r public ${BUILD_DIR}/" "Copying public files"; then
  print_message "${RED}" "ERROR" "Failed to copy public files"
  exit 1
fi

# Copy the package.json file to the simulation directory
if ! run_command "cp package.json ${BUILD_DIR}/" "Copying package.json"; then
  print_message "${RED}" "ERROR" "Failed to copy package.json"
  exit 1
fi

# Copy the amplify-prebuild.sh script to the simulation directory
if ! run_command "cp amplify-prebuild.sh ${BUILD_DIR}/" "Copying amplify-prebuild.sh"; then
  print_message "${RED}" "ERROR" "Failed to copy amplify-prebuild.sh"
  exit 1
fi

# Step 4: Simulate AWS Amplify deployment
print_message "${CYAN}" "STEP 4" "Simulating AWS Amplify deployment"

# Create a simple HTML file to simulate the deployed application
cat > ${BUILD_DIR}/index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AlexAI - Deployment Simulation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      background-color: #3a6ea5;
      color: white;
      padding: 1rem;
      text-align: center;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .content {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .success {
      color: #28a745;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AlexAI - Deployment Simulation</h1>
    </div>
    <div class="content">
      <h2>Deployment Successful!</h2>
      <p>The application has been successfully deployed to AWS Amplify (simulated).</p>
      <p class="success">✓ PDF extraction process completed successfully</p>
      <p class="success">✓ Build process completed successfully</p>
      <p class="success">✓ Deployment process completed successfully</p>
      <h3>Extracted PDF Information</h3>
      <p>The following information was extracted from the PDF:</p>
      <ul>
        <li>Text content: <code>public/extracted/resume_content.txt</code></li>
        <li>Markdown content: <code>public/extracted/resume_content.md</code></li>
        <li>Color theory: <code>public/extracted/color_theory.json</code></li>
        <li>Font theory: <code>public/extracted/font_theory.json</code></li>
      </ul>
    </div>
  </div>
</body>
</html>
EOL

# Step 5: Open the simulated deployment in a browser
print_message "${CYAN}" "STEP 5" "Opening the simulated deployment in a browser"

# Get the absolute path to the index.html file
INDEX_PATH=$(realpath ${BUILD_DIR}/index.html)

# Open the index.html file in a browser
if command -v open > /dev/null; then
  # macOS
  open "file://${INDEX_PATH}"
elif command -v xdg-open > /dev/null; then
  # Linux
  xdg-open "file://${INDEX_PATH}"
elif command -v start > /dev/null; then
  # Windows
  start "file://${INDEX_PATH}"
else
  print_message "${YELLOW}" "WARNING" "Could not open browser automatically"
  print_message "${BLUE}" "INFO" "Please open the following file in your browser:"
  print_message "${BLUE}" "INFO" "file://${INDEX_PATH}"
fi

# Print success message
print_message "${GREEN}" "SUCCESS" "Deployment simulation completed successfully"
print_message "${BLUE}" "INFO" "In a real deployment, the application would now be available at your AWS Amplify URL"
print_message "${BLUE}" "INFO" "You can clean up the simulation files by running: rm -rf ${BUILD_DIR}"
