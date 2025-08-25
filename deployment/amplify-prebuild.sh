#!/bin/bash
# This script ensures the correct Node.js version is used for Amplify builds
# and ensures the PDF file is properly included in the build
# It runs the PDF extraction process before the build to ensure styles are available
if [ -f ".env.local" ]; then
  echo "[ENV] ✅ .env.local file detected."
else
  echo "[ENV] ❌ .env.local file missing. Build may fail."
  exit 1
fi
# Print current Node.js and npm versions
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"
echo "Amplify Prebuild \n\n\n\n"
# Create .npmrc file to ignore engine requirements
echo "engine-strict=false" >.npmrc
echo "ignore-engines=true" >>.npmrc
cat .npmrc

# Check if the PDF file exists
if [ -f "public/pbradygeorgen_resume.pdf" ]; then
    echo "PDF file found: public/pbradygeorgen_resume.pdf"
    echo "Last modified: $(stat -c %y public/pbradygeorgen_resume.pdf 2>/dev/null || stat -f "%Sm" public/pbradygeorgen_resume.pdf)"

    # Run the comprehensive PDF extraction process
    echo "Running PDF extraction process..."
    node scripts/prebuild-pdf-extraction.js

    if [ $? -eq 0 ]; then
        echo "PDF extraction process completed successfully"
    else
        echo "Warning: PDF extraction process failed, but continuing build"
    fi

    # Generate the reference.docx template with PDF-extracted styles
    echo "Generating reference.docx template with PDF-extracted styles..."
    node scripts/generate-reference-docx.js

    if [ $? -eq 0 ]; then
        echo "Reference DOCX template generated successfully"
    else
        echo "Warning: Reference DOCX template generation failed, but continuing build"
    fi
else
    echo "Warning: PDF file not found at public/pbradygeorgen_resume.pdf"
fi

# Exit with success
exit 0
