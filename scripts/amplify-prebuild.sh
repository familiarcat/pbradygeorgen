#!/bin/bash
# This script ensures the correct Node.js version is used for Amplify builds
# and ensures the PDF file is properly included in the build
# Following Dante's philosophy of guiding through different stages with clear logging

# Print current Node.js and npm versions
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Create .npmrc file to ignore engine requirements
echo "engine-strict=false" >.npmrc
echo "ignore-engines=true" >>.npmrc
cat .npmrc

# Set up Amplify environment
echo "Setting up Amplify environment..."
node scripts/setup-amplify-env.js

if [ $? -eq 0 ]; then
    echo "Amplify environment set up successfully"
else
    echo "Warning: Amplify environment setup failed, but continuing build"
fi

# Check for source PDFs first
if [ -d "source-pdfs" ] && [ "$(ls -A source-pdfs/*.pdf 2>/dev/null)" ]; then
    echo "Found source PDFs in source-pdfs directory..."
    # Get the most recent PDF file
    LATEST_SOURCE_PDF=$(ls -t source-pdfs/*.pdf | head -1)
    echo "Using latest source PDF: $LATEST_SOURCE_PDF"

    # Update the source PDF
    node scripts/update-source-pdf.js update "$LATEST_SOURCE_PDF"

    if [ $? -eq 0 ]; then
        echo "Source PDF updated and processed successfully"
    else
        echo "Warning: Source PDF update failed, falling back to existing PDFs"

        # Check if any PDF file exists in public directory
        if [ -f "public/default_resume.pdf" ] || [ -f "public/pbradygeorgen_resume.pdf" ]; then
            # Run the PDF reference manager script
            echo "Managing existing PDF references..."
            node scripts/manage-pdf-references.js
        else
            echo "Warning: No PDF files found in public directory"

            # Check if we have test PDFs
            if [ -d "public/test-pdfs" ]; then
                echo "Using a test PDF as fallback..."
                cp public/test-pdfs/layout/single-column.pdf public/default_resume.pdf
                cp public/test-pdfs/layout/single-column.pdf public/pbradygeorgen_resume.pdf

                # Run the PDF reference manager script
                node scripts/manage-pdf-references.js
            else
                echo "Creating an empty PDF file as placeholder..."
                touch public/default_resume.pdf
                touch public/pbradygeorgen_resume.pdf
            fi
        fi
    fi
else
    # Check if any PDF file exists in public directory
    if [ -f "public/default_resume.pdf" ] || [ -f "public/pbradygeorgen_resume.pdf" ]; then
        # Run the PDF reference manager script
        echo "Managing existing PDF references..."
        node scripts/manage-pdf-references.js

        if [ $? -eq 0 ]; then
            echo "PDF content processed successfully"
        else
            echo "Warning: PDF processing failed, but continuing build"
        fi
    else
        echo "Warning: No PDF files found in public directory"

        # Check if we have test PDFs
        if [ -d "public/test-pdfs" ]; then
            echo "Using a test PDF as fallback..."
            cp public/test-pdfs/layout/single-column.pdf public/default_resume.pdf
            cp public/test-pdfs/layout/single-column.pdf public/pbradygeorgen_resume.pdf

            # Run the PDF reference manager script
            node scripts/manage-pdf-references.js
        else
            echo "Creating an empty PDF file as placeholder..."
            touch public/default_resume.pdf
            touch public/pbradygeorgen_resume.pdf
        fi
    fi
fi

# Create necessary directories for the download test page
mkdir -p public/downloads
mkdir -p public/extracted

# Ensure the download test report exists
if [ ! -f "public/download_test_report.json" ]; then
    echo "Creating download test report..."
    echo '{
        "pdfSource": "default_resume.pdf",
        "formats": [
            {
                "name": "Plain Text",
                "description": "Simple text format",
                "path": "/extracted/resume_content.txt",
                "icon": "📄"
            },
            {
                "name": "Markdown",
                "description": "Formatted markdown",
                "path": "/extracted/resume_content.md",
                "icon": "📝"
            },
            {
                "name": "JSON",
                "description": "Structured data",
                "path": "/extracted/resume_content.json",
                "icon": "📊"
            },
            {
                "name": "Original PDF",
                "description": "Original PDF file",
                "path": "/default_resume.pdf",
                "icon": "📎"
            }
        ],
        "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
    }' >public/download_test_report.json
fi

# Sync PDFs to S3 if we're in an Amplify environment
if [ -n "$AWS_REGION" ] && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "Syncing PDFs to S3..."
    node scripts/sync-pdfs-to-s3.js

    if [ $? -eq 0 ]; then
        echo "PDFs synced to S3 successfully"
    else
        echo "Warning: S3 sync failed, but continuing build"
    fi
else
    echo "Skipping S3 sync in local development environment"
fi

# Exit with success
exit 0
