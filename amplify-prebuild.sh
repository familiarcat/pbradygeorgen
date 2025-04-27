#!/bin/bash
# This script ensures the correct Node.js version is used for Amplify builds
# and ensures the PDF file is properly included in the build

# Print current Node.js and npm versions
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Create .npmrc file to ignore engine requirements
echo "engine-strict=false" >.npmrc
echo "ignore-engines=true" >>.npmrc
cat .npmrc

# Verify the PDF content first
echo "Verifying PDF content..."
node scripts/verify-pdf-content.js

# Check if the verification was successful
if [ $? -ne 0 ]; then
    echo "Error: PDF content verification failed"
    exit 1  # Exit with error to fail the build
fi

# Run the dynamic PDF extraction process
echo "Running dynamic PDF extraction process..."
./amplify-dynamic-pdf.sh

# Check if the extraction was successful
if [ $? -ne 0 ]; then
    echo "Error: Dynamic PDF extraction failed"
    exit 1  # Exit with error to fail the build
fi

# Exit with success
exit 0
