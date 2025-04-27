#!/bin/bash

# Make the script executable
chmod +x ./extract-pdf.sh

# Print the current directory
echo "Current directory: $(pwd)"

# Check if the PDF file exists
if [ -f "./public/default_resume.pdf" ]; then
  echo "PDF file exists"
  # Print the file's last modified time
  echo "Last modified: $(stat -f "%Sm" ./public/default_resume.pdf)"
else
  echo "PDF file does not exist"
  exit 1
fi

# Run the extraction script
echo "Running extraction script..."
node scripts/extract-pdf-text-improved.js "./public/default_resume.pdf"

# Check if the extraction was successful
if [ -f "./public/extracted/resume_content.md" ]; then
  echo "Extraction successful"
  # Print the first few lines of the markdown file
  echo "First few lines of the markdown file:"
  head -n 10 ./public/extracted/resume_content.md
else
  echo "Extraction failed"
  exit 1
fi

echo "Done!"
