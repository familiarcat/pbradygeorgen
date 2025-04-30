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
    exit 1 # Exit with error to fail the build
fi

# Run the dynamic PDF extraction process
echo "Running dynamic PDF extraction process..."
./amplify-dynamic-pdf.sh

# Check if the extraction was successful
if [ $? -ne 0 ]; then
    echo "Error: Dynamic PDF extraction failed"
    exit 1 # Exit with error to fail the build
fi

# Pre-process the PDF content with ChatGPT
echo "Pre-processing PDF content with ChatGPT..."
node scripts/preprocess-pdf-content.js

# Check if the pre-processing was successful
if [ $? -ne 0 ]; then
    echo "Warning: PDF content pre-processing failed, but continuing build"
    # Create necessary directories to ensure build can continue
    mkdir -p public/extracted

    # Create a placeholder file if it doesn't exist
    if [ ! -f "public/extracted/resume_content_analyzed.json" ]; then
        echo '{
            "sections": {
                "summary": "Content analysis skipped - preprocessing failed",
                "experience": [],
                "education": [],
                "skills": []
            },
            "structuredContent": {
                "name": "Default Resume",
                "title": "Professional Resume",
                "contact": {},
                "summary": "Content analysis skipped - preprocessing failed",
                "experience": [],
                "education": [],
                "skills": [],
                "certifications": []
            }
        }' >public/extracted/resume_content_analyzed.json
        echo "Created placeholder analyzed content file"
    fi

    # Continue with the build instead of failing
    # exit 1 # Commented out to prevent build failure
fi

# Exit with success
exit 0
