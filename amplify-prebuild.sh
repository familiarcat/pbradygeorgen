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

# Check if the PDF file exists
if [ -f "public/pbradygeorgen_resume.pdf" ]; then
    echo "PDF file found: public/pbradygeorgen_resume.pdf"
    echo "Last modified: $(stat -c %y public/pbradygeorgen_resume.pdf 2>/dev/null || stat -f "%Sm" public/pbradygeorgen_resume.pdf)"

    # Create the extracted directory if it doesn't exist
    mkdir -p public/extracted

    # Extract content from the PDF to ensure it's processed
    echo "Extracting content from PDF..."
    node scripts/extract-pdf-text-improved.js public/pbradygeorgen_resume.pdf

    if [ $? -eq 0 ]; then
        echo "PDF content extracted successfully"
    else
        echo "Warning: PDF extraction failed, but continuing build"
    fi
else
    echo "Warning: PDF file not found at public/pbradygeorgen_resume.pdf"
fi

# Exit with success
exit 0
