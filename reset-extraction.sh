#!/bin/bash
# reset-extraction.sh - Complete reset of all extracted content and caches

echo "🔄 Starting complete reset of all extracted content and caches"

# Remove all extracted content
echo "🗑️ Removing all extracted content..."
rm -rf public/extracted/*

# Remove any cached files
echo "🗑️ Removing cached files..."
rm -rf .next/cache/*

# Remove any browser cache indicators
echo "🗑️ Removing browser cache indicators..."
find public -name "*.cache" -delete

# Create the extracted directory if it doesn't exist
mkdir -p public/extracted

# Check if the PDF file exists
if [ ! -f "public/default_resume.pdf" ]; then
  echo "❌ Error: default_resume.pdf not found in public directory"
  exit 1
fi

# Print the PDF file's last modified time
echo "📄 PDF file: public/default_resume.pdf"
echo "⏱️ Last modified: $(stat -c %y public/default_resume.pdf 2>/dev/null || stat -f "%Sm" public/default_resume.pdf)"

# Extract text content with improved extraction
echo "📝 Extracting text content with improved extraction..."
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
  
  echo "🎨 Color theme preview:"
  cat public/extracted/color_theme.json | grep -E "primary|secondary|accent|background|text"
  
  echo "🔤 Font information preview:"
  cat public/extracted/font_info.json | head -n 10
else
  echo "❌ Extraction failed"
  exit 1
fi

echo "✅ Reset and extraction completed successfully"
echo "🚀 Run 'npm run dev' to start the application with fresh content"
