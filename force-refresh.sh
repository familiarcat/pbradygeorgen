#!/bin/bash
# force-refresh.sh - Force refresh all extracted content from the default_resume.pdf file

echo "🔄 Force refreshing all extracted content from default_resume.pdf"

# Check if the PDF file exists
if [ ! -f "public/default_resume.pdf" ]; then
  echo "❌ Error: default_resume.pdf not found in public directory"
  exit 1
fi

# Print the PDF file's last modified time
echo "📄 PDF file: public/default_resume.pdf"
echo "⏱️ Last modified: $(stat -c %y public/default_resume.pdf 2>/dev/null || stat -f "%Sm" public/default_resume.pdf)"

# Remove all extracted content to force regeneration
echo "🗑️ Removing all extracted content..."
rm -rf public/extracted/*

# Create the extracted directory if it doesn't exist
mkdir -p public/extracted

# Extract text content
echo "📝 Extracting text content..."
node scripts/extract-pdf-text-improved.js public/default_resume.pdf

# Extract font information
echo "🔤 Extracting font information..."
node scripts/extract-pdf-fonts.js public/default_resume.pdf

# Extract color information
echo "🎨 Extracting color information..."
node scripts/extract-pdf-colors.js public/default_resume.pdf

# Check if extraction was successful
if [ -f "public/extracted/resume_content.md" ] && [ -f "public/extracted/pdf_fonts.css" ] && [ -f "public/extracted/color_theme.json" ]; then
  echo "✅ Extraction completed successfully"
  
  # Print a preview of the extracted content
  echo "📄 Extracted content preview:"
  head -n 10 public/extracted/resume_content.md
  
  # Add the extracted content to git
  echo "📦 Adding extracted content to git..."
  git add public/extracted/*
  
  # Commit the changes if there are any
  if [[ -n $(git status -s public/extracted/) ]]; then
    git commit -m "Force refresh extracted content from default_resume.pdf"
    echo "✅ Extracted content committed"
  else
    echo "ℹ️ No changes to commit"
  fi
else
  echo "❌ Extraction failed"
  exit 1
fi

echo "✅ Force refresh completed successfully"
