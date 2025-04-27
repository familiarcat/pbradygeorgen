#!/bin/bash
# Script to update the PDF and force extraction of content

# Check if a file path is provided
if [ $# -eq 0 ]; then
  echo "Usage: ./update-pdf.sh <path-to-new-pdf>"
  echo "Example: ./update-pdf.sh ~/Downloads/updated_resume.pdf"
  exit 1
fi

NEW_PDF_PATH="$1"
TARGET_PATH="public/default_resume.pdf"

# Check if the source file exists
if [ ! -f "$NEW_PDF_PATH" ]; then
  echo "Error: Source PDF file not found at $NEW_PDF_PATH"
  exit 1
fi

# Copy the new PDF to the public directory
echo "Copying $NEW_PDF_PATH to $TARGET_PATH..."
cp "$NEW_PDF_PATH" "$TARGET_PATH"

if [ $? -ne 0 ]; then
  echo "Error: Failed to copy the PDF file"
  exit 1
fi

echo "PDF file updated successfully"
echo "New PDF last modified: $(stat -c %y "$TARGET_PATH" 2>/dev/null || stat -f "%Sm" "$TARGET_PATH")"

# Create the extracted directory if it doesn't exist
mkdir -p public/extracted

# Extract content from the PDF
echo "Extracting content from the updated PDF..."
node scripts/extract-pdf-text-improved.js "$TARGET_PATH"

if [ $? -eq 0 ]; then
  echo "PDF content extracted successfully"
else
  echo "Error: PDF extraction failed"
  exit 1
fi

# Add the updated PDF to git
echo "Adding the updated PDF to git..."
git add "$TARGET_PATH" public/extracted/*

echo "Committing the changes..."
git commit -m "Update resume PDF and extracted content"

echo "PDF update complete. You can now push the changes or deploy the application."
echo "To deploy: ./deploy.sh"
