#!/bin/bash
# amplify-local-test.sh - Test the application in a way that mirrors AWS Amplify deployment
# This script runs a full build and starts the application in production mode

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 AMPLIFY LOCAL TEST"
echo "====================="
echo "This script will build and run the application in a way that mirrors AWS Amplify deployment"
echo "Timestamp: $(date)"

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
  # Try to get it from .zshrc if available
  if [ -f "$HOME/.zshrc" ] && grep -q "OPENAI_API_KEY" "$HOME/.zshrc"; then
    echo "🔑 Sourcing OpenAI API key from .zshrc..."
    source "$HOME/.zshrc"
  fi
  
  # Check again
  if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️ Warning: OPENAI_API_KEY environment variable is not set"
    echo "Some features may not work correctly"
    
    # Create a temporary .env.local file with a placeholder API key
    echo "Creating a temporary .env.local file with a placeholder API key"
    echo "OPENAI_API_KEY=sk-placeholder-for-local-build" > .env.local
  else
    echo "✅ OpenAI API key found in environment"
    # Create a temporary .env.local file with the real API key
    echo "Creating a temporary .env.local file with your API key"
    echo "OPENAI_API_KEY=$OPENAI_API_KEY" > .env.local
  fi
fi

# Clean up previous build artifacts
echo "🧹 Cleaning up previous build artifacts..."
rm -rf .next
rm -rf public/extracted/*
mkdir -p public/extracted

# Run the prebuild script
echo "🔄 Running prebuild script..."
./amplify-prebuild.sh

# Build the application
echo "🏗️ Building the application..."
next build

# Run the postbuild script to copy extracted files
echo "📋 Running postbuild script..."
node copy-extracted.js

# Check if the standalone directory exists
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: Standalone directory not found. Build may have failed."
  exit 1
fi

# Check if the server.js file exists
if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ Error: server.js not found in standalone directory. Build may have failed."
  exit 1
fi

# Start the application
echo "🚀 Starting the application in production mode..."
echo "The application will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "====================="

# Change to the standalone directory and start the server
cd .next/standalone
node server.js
