#!/bin/bash
# amplify-start.sh - Custom start script for AWS Amplify

# Print environment information
echo "Starting server in AWS Amplify environment"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're in the standalone directory
if [ -d ".next/standalone" ]; then
  echo "Found .next/standalone directory, using it"
  cd .next/standalone
  echo "Standalone directory contents:"
  ls -la
  
  # Create necessary directories
  mkdir -p public/extracted
  
  # Start the server
  echo "Starting server from standalone directory"
  node server.js
else
  # Start the server from the current directory
  echo "Starting server from current directory"
  node server.js
fi
