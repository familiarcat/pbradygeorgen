#!/bin/bash
# Production Testing Script for AWS Amplify 2025 Compatibility
# This script builds and tests the application in a production-like environment

# Set strict error handling
set -e

# Text formatting
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

# Dante-inspired emojis for logging
DANTE_INFO="😇"
DANTE_SUCCESS="😇🌟"
DANTE_WARNING="😨"
DANTE_ERROR="😱"

# Print header
echo -e "${BOLD}${BLUE}=========================================${RESET}"
echo -e "${BOLD}${BLUE}  Production Testing for AWS Amplify 2025${RESET}"
echo -e "${BOLD}${BLUE}=========================================${RESET}"

# Check Node.js version (AWS Amplify 2025 uses Node.js 20)
NODE_VERSION=$(node -v)
echo -e "${DANTE_INFO} Node.js version: ${NODE_VERSION}"
if [[ ! $NODE_VERSION =~ ^v20 ]]; then
  echo -e "${DANTE_WARNING} ${YELLOW}Warning: AWS Amplify 2025 uses Node.js 20. Current version: ${NODE_VERSION}${RESET}"
  echo -e "${YELLOW}Consider using nvm to switch to Node.js 20:${RESET}"
  echo -e "${YELLOW}  nvm use 20${RESET}"
  
  # Ask if user wants to continue
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${DANTE_ERROR} ${RED}Aborting production test.${RESET}"
    exit 1
  fi
fi

# Check for environment variables
echo -e "${DANTE_INFO} Checking environment variables..."
if [ -f .env.local ]; then
  echo -e "${DANTE_SUCCESS} ${GREEN}Found .env.local file${RESET}"
else
  echo -e "${DANTE_WARNING} ${YELLOW}No .env.local file found. Creating a template...${RESET}"
  echo "# Required environment variables for AWS Amplify deployment" > .env.local
  echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env.local
  echo -e "${YELLOW}Please edit .env.local with your actual environment variables${RESET}"
  
  # Ask if user wants to continue
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${DANTE_ERROR} ${RED}Aborting production test.${RESET}"
    exit 1
  fi
fi

# Clean previous build
echo -e "${DANTE_INFO} Cleaning previous build..."
if [ -d ".next" ]; then
  rm -rf .next
  echo -e "${GREEN}Previous build cleaned successfully${RESET}"
fi

# Install dependencies if node_modules doesn't exist or is empty
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  echo -e "${DANTE_INFO} Installing dependencies..."
  npm ci
  echo -e "${GREEN}Dependencies installed successfully${RESET}"
fi

# Run prebuild script (similar to Amplify)
echo -e "${DANTE_INFO} Running prebuild script..."
if [ -f "amplify-prebuild.sh" ]; then
  chmod +x amplify-prebuild.sh
  ./amplify-prebuild.sh
  echo -e "${GREEN}Prebuild completed successfully${RESET}"
else
  echo -e "${DANTE_ERROR} ${RED}amplify-prebuild.sh not found!${RESET}"
  exit 1
fi

# Build the application
echo -e "${DANTE_INFO} Building the application (production mode)..."
npm run build
BUILD_RESULT=$?

if [ $BUILD_RESULT -ne 0 ]; then
  echo -e "${DANTE_ERROR} ${RED}Build failed with exit code ${BUILD_RESULT}${RESET}"
  exit $BUILD_RESULT
else
  echo -e "${DANTE_SUCCESS} ${GREEN}Build completed successfully${RESET}"
fi

# Determine an available port (default: 3000)
PORT=3000
while nc -z localhost $PORT >/dev/null 2>&1; do
  echo -e "${DANTE_WARNING} ${YELLOW}Port $PORT is already in use. Trying next port...${RESET}"
  PORT=$((PORT + 1))
done
echo -e "${DANTE_INFO} Using port: $PORT"

# Start the application in production mode
echo -e "${DANTE_INFO} Starting the application in production mode on port $PORT..."
npm run start -- -p $PORT &
SERVER_PID=$!

# Function to clean up server process on exit
cleanup() {
  echo -e "${DANTE_INFO} Stopping server (PID: $SERVER_PID)..."
  kill $SERVER_PID 2>/dev/null || true
  echo -e "${GREEN}Server stopped${RESET}"
}

# Register cleanup function
trap cleanup EXIT

# Wait for server to start
echo -e "${DANTE_INFO} Waiting for server to start..."
MAX_RETRIES=30
RETRY_COUNT=0
SERVER_READY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if nc -z localhost $PORT >/dev/null 2>&1; then
    SERVER_READY=true
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo -n "."
  sleep 1
done

echo ""

if [ "$SERVER_READY" = true ]; then
  echo -e "${DANTE_SUCCESS} ${GREEN}Server started successfully on http://localhost:$PORT${RESET}"
  
  # Open browser
  echo -e "${DANTE_INFO} Opening browser..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:$PORT"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:$PORT"
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start "http://localhost:$PORT"
  else
    echo -e "${DANTE_WARNING} ${YELLOW}Could not open browser automatically. Please open http://localhost:$PORT manually.${RESET}"
  fi
  
  # Run basic health check
  echo -e "${DANTE_INFO} Running basic health check..."
  HEALTH_CHECK_RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
  
  if [ "$HEALTH_CHECK_RESULT" -eq 200 ]; then
    echo -e "${DANTE_SUCCESS} ${GREEN}Health check passed (HTTP 200)${RESET}"
  else
    echo -e "${DANTE_ERROR} ${RED}Health check failed (HTTP ${HEALTH_CHECK_RESULT})${RESET}"
  fi
  
  # Instructions for manual testing
  echo -e "\n${BOLD}${BLUE}Manual Testing Instructions:${RESET}"
  echo -e "1. Verify the application loads correctly in the browser"
  echo -e "2. Test the Cover Letter functionality"
  echo -e "3. Test the Resume download functionality"
  echo -e "4. Verify PDF previews work correctly"
  echo -e "5. Check that all styling is consistent with the Salinger design principles"
  echo -e "\n${BOLD}${BLUE}Press Ctrl+C when testing is complete${RESET}\n"
  
  # Keep script running until user presses Ctrl+C
  wait $SERVER_PID
else
  echo -e "${DANTE_ERROR} ${RED}Server failed to start after ${MAX_RETRIES} seconds${RESET}"
  exit 1
fi
