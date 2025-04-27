#!/bin/bash
# amplify-dynamic-pdf.sh - Ensures dynamic PDF content extraction for Amplify builds
# This script forces fresh extraction from the current PDF and clears all caches

set -e # Exit immediately if a command exits with a non-zero status

echo "🔄 AMPLIFY DYNAMIC PDF EXTRACTION PROCESS"
echo "=========================================="
echo "Build timestamp: $(date)"

# 1. Identify the current PDF
PDF_PATH="public/default_resume.pdf"
if [ ! -f "$PDF_PATH" ]; then
  echo "❌ ERROR: PDF file not found at $PDF_PATH"
  exit 1
fi

# Get PDF metadata
PDF_SIZE=$(stat -f%z "$PDF_PATH" 2>/dev/null || stat -c%s "$PDF_PATH")
PDF_MODIFIED=$(stat -f%m "$PDF_PATH" 2>/dev/null || stat -c%Y "$PDF_PATH")
PDF_MODIFIED_DATE=$(date -r "$PDF_MODIFIED" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -d "@$PDF_MODIFIED" "+%Y-%m-%d %H:%M:%S")

echo "📄 PDF file: $PDF_PATH"
echo "📊 Size: $PDF_SIZE bytes"
echo "⏱️ Last modified: $PDF_MODIFIED_DATE"
echo "🔑 Unique identifier: pdf_${PDF_SIZE}_${PDF_MODIFIED}"

# 2. Force removal of all extracted content and caches
echo "🗑️ Removing all extracted content..."
rm -rf public/extracted/*
mkdir -p public/extracted

echo "🗑️ Removing Next.js cache..."
rm -rf .next/cache/*

echo "🗑️ Removing ChatGPT cache..."
# Create a marker file to indicate cache should be invalidated
echo "pdf_${PDF_SIZE}_${PDF_MODIFIED}" >public/extracted/pdf_cache_marker.txt

# 3. Extract text content with verification
echo "📝 Extracting text content..."
node scripts/extract-pdf-text-improved.js "$PDF_PATH"

# Verify extraction worked
if [ ! -f "public/extracted/resume_content.md" ]; then
  echo "❌ ERROR: Text extraction failed"
  exit 1
fi

# 4. Extract a content fingerprint to verify we're using the right PDF
CONTENT_PREVIEW=$(head -n 20 public/extracted/resume_content.md)
CONTENT_HASH=$(echo "$CONTENT_PREVIEW" | shasum -a 256 | cut -d' ' -f1)
echo "🔍 Content fingerprint: $CONTENT_HASH"
echo "$CONTENT_HASH" >public/extracted/content_fingerprint.txt

# 5. Extract font information
echo "🔤 Extracting font information..."
node scripts/extract-pdf-fonts.js "$PDF_PATH"

# 6. Extract color information
echo "🎨 Extracting color information..."
node scripts/extract-pdf-colors.js "$PDF_PATH"

# 7. Create a build info file for debugging
cat >public/extracted/build_info.json <<EOL
{
  "buildTimestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "pdfInfo": {
    "path": "$PDF_PATH",
    "size": $PDF_SIZE,
    "lastModified": "$PDF_MODIFIED_DATE",
    "contentFingerprint": "$CONTENT_HASH"
  },
  "extractionStatus": {
    "textExtracted": $([ -f "public/extracted/resume_content.md" ] && echo "true" || echo "false"),
    "fontsExtracted": $([ -f "public/extracted/font_info.json" ] && echo "true" || echo "false"),
    "colorsExtracted": $([ -f "public/extracted/color_theme.json" ] && echo "true" || echo "false")
  }
}
EOL

echo "📊 Build info saved to public/extracted/build_info.json"

# 8. Print a summary of the extracted content
echo "✅ Extraction completed successfully"
echo "📄 Extracted content preview:"
if [ -f "public/extracted/resume_content.md" ]; then
  head -n 10 public/extracted/resume_content.md
else
  echo "Warning: resume_content.md not found"
fi

echo "🎨 Color theme preview:"
if [ -f "public/extracted/color_theme.json" ]; then
  grep -E "primary|secondary|accent|background|text" public/extracted/color_theme.json || echo "No color theme data found"
else
  echo "Warning: color_theme.json not found"
fi

echo "🔤 Font information preview:"
if [ -f "public/extracted/font_info.json" ]; then
  head -n 10 public/extracted/font_info.json
else
  echo "Warning: font_info.json not found"
fi

echo "✅ PDF content extraction process completed"
echo "=========================================="
