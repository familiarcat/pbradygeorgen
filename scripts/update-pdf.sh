#!/bin/bash
# Script to update the PDF and force extraction of content

# Check if a file path is provided
if [ $# -eq 0 ]; then
  echo "Usage: ./scripts/update-pdf.sh <path-to-new-pdf>"
  echo "Example: ./scripts/update-pdf.sh ~/Downloads/updated_resume.pdf"
  exit 1
fi

NEW_PDF_PATH="$1"
TARGET_PATH="public/pbradygeorgen_resume.pdf"

# Check if the source file exists
if [ ! -f "$NEW_PDF_PATH" ]; then
  echo "Error: Source PDF file not found at $NEW_PDF_PATH"
  exit 1
fi

# Create a backup of the current PDF
BACKUP_DIR="public/backup"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/pbradygeorgen_resume_$TIMESTAMP.pdf"

if [ -f "$TARGET_PATH" ]; then
  echo "Creating backup of current PDF at $BACKUP_PATH..."
  cp "$TARGET_PATH" "$BACKUP_PATH"
  echo "Backup created successfully."
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

# Extract colors from the PDF
echo "Extracting colors from the updated PDF..."
node scripts/extract-pdf-colors.js "$TARGET_PATH"

if [ $? -eq 0 ]; then
  echo "PDF colors extracted successfully"
else
  echo "Warning: PDF color extraction failed, but continuing"
fi

# Extract fonts from the PDF
echo "Extracting fonts from the updated PDF..."
node scripts/extract-pdf-fonts.js "$TARGET_PATH"

if [ $? -eq 0 ]; then
  echo "PDF fonts extracted successfully"
else
  echo "Warning: PDF font extraction failed, but continuing"
fi

# Generate improved markdown
echo "Generating improved markdown..."
node scripts/generate-improved-markdown.js "public/extracted/resume_content.txt"

if [ $? -eq 0 ]; then
  echo "Improved markdown generated successfully"
else
  echo "Warning: Improved markdown generation failed, but continuing"
fi

echo "PDF update complete. You can now test the application with the new PDF."
echo "To test locally, run: npm run dev"
echo ""
echo "To restore the previous PDF, run:"
echo "cp \"$BACKUP_PATH\" \"$TARGET_PATH\""
echo "node scripts/extract-pdf-text-improved.js \"$TARGET_PATH\""
