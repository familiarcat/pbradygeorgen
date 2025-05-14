# Guide to Replacing the Source PDF in AlexAI

This guide will walk you through the process of replacing the source PDF in AlexAI and updating all the AI color and content extraction to use the new content.

## Overview

The AlexAI application extracts content, colors, and fonts from a PDF file to generate summaries and style the application. When replacing the source PDF, we need to ensure that all these components are updated correctly.

## Prerequisites

1. The new PDF file you want to use
2. Node.js and npm installed
3. OpenAI API key (for improved content extraction)

## Step 1: Replace the Source PDF

We've created a script that automates the process of replacing the PDF and running all the necessary extraction steps:

```bash
# Make sure the script is executable
chmod +x scripts/update-pdf.sh

# Run the script with the path to your new PDF
./scripts/update-pdf.sh /path/to/your/new/resume.pdf
```

This script will:
1. Create a backup of the current PDF
2. Copy your new PDF to the correct location
3. Extract text content from the PDF
4. Extract colors from the PDF
5. Extract fonts from the PDF
6. Generate improved markdown using AI

## Step 2: Verify the Extraction Results

After running the script, check the extracted files to ensure they contain the correct information:

```bash
# Check the extracted text content
cat public/extracted/resume_content.txt

# Check the extracted markdown
cat public/extracted/resume_content.md

# Check the extracted color theory
cat public/extracted/color_theory.json
```

If you notice any issues with the extraction, you may need to adjust the extraction scripts or run them individually with custom parameters.

## Step 3: Fix Inconsistencies in Markdown and Text Extractions

If you notice inconsistencies in the markdown and text extractions (such as dates not aligning or duplicate descriptions), you can:

1. **Edit the extracted files directly**:
   ```bash
   # Edit the markdown file
   nano public/extracted/resume_content.md
   ```

2. **Regenerate the markdown with improved prompts**:
   ```bash
   # Set your OpenAI API key
   export OPENAI_API_KEY=your_api_key_here
   
   # Run the markdown generation script
   node scripts/generate-improved-markdown.js public/extracted/resume_content.txt
   ```

3. **Adjust the OpenAI prompts** in `scripts/generate-improved-markdown.js` to better handle your specific PDF format.

## Step 4: Update the Styling of the Generated Summary PDF

The styling of the generated summary PDF is controlled by the color theory extracted from your PDF and the PDF generator code. To update the styling:

1. **Check the extracted color theory**:
   ```bash
   cat public/extracted/color_theory.json
   ```

2. **Manually adjust the colors** if needed:
   ```bash
   # Edit the color theory file
   nano public/extracted/color_theory.json
   ```

3. **Test the summary generation** to see if the styling matches your expectations:
   ```bash
   # Start the development server
   npm run dev
   
   # Navigate to the summary page in your browser
   # http://localhost:3000/summary
   ```

## Step 5: Test the Application

Start the development server and test the application to ensure everything is working correctly:

```bash
npm run dev
```

Visit the following pages to verify that the new PDF content and styling are being used correctly:
- Home page: http://localhost:3000
- PDF Viewer: http://localhost:3000/pdf-viewer
- Summary: http://localhost:3000/summary
- Color Theme: http://localhost:3000/color-theme

## Troubleshooting

### Issue: PDF Text Extraction Failed

If the text extraction fails, try using a different extraction method:

```bash
# Try the simple extraction method
node scripts/extract-pdf-text-simple.js public/pbradygeorgen_resume.pdf

# Try the pdf-parse extraction method
node scripts/extract-pdf-text-with-pdf-parse.js public/pbradygeorgen_resume.pdf
```

### Issue: Color Extraction Failed

If the color extraction fails, you can manually create a color theory file:

```bash
# Create a basic color theory file
cat > public/extracted/color_theory.json << EOL
{
  "primary": "#3a6ea5",
  "secondary": "#004e98",
  "accent": "#ff6700",
  "background": "#ffffff",
  "text": "#000000",
  "textSecondary": "#333333",
  "border": "#dddddd",
  "success": "#28a745",
  "warning": "#ffc107",
  "error": "#dc3545",
  "info": "#17a2b8",
  "allColors": ["#3a6ea5", "#004e98", "#ff6700"]
}
EOL
```

### Issue: Markdown Generation Failed

If the markdown generation fails, you can manually create a markdown file:

```bash
# Create a basic markdown file
cat > public/extracted/resume_content.md << EOL
# Your Name

## Contact Information
- Email: your.email@example.com
- Phone: (123) 456-7890
- Location: Your Location

## Summary
A brief summary of your professional background and skills.

## Skills
- Skill 1
- Skill 2
- Skill 3

## Experience
### Job Title
**Company Name** (Start Year - End Year)
Description of your responsibilities and achievements.

## Education
### Degree
**Institution** (Start Year - End Year)
EOL
```

### Issue: OpenAI API Key Not Set

If you're having issues with the OpenAI API, make sure your API key is set correctly:

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=your_api_key_here

# Verify the API key is set
echo $OPENAI_API_KEY
```

## Restoring the Previous PDF

If you need to restore the previous PDF, you can use the backup created by the update script:

```bash
# List available backups
ls -la public/backup

# Restore a specific backup
cp public/backup/pbradygeorgen_resume_TIMESTAMP.pdf public/pbradygeorgen_resume.pdf

# Re-run the extraction process
node scripts/extract-pdf-text-improved.js public/pbradygeorgen_resume.pdf
node scripts/extract-pdf-colors.js public/pbradygeorgen_resume.pdf
node scripts/extract-pdf-fonts.js public/pbradygeorgen_resume.pdf
node scripts/generate-improved-markdown.js public/extracted/resume_content.txt
```

## Conclusion

By following this guide, you should be able to successfully replace the source PDF in AlexAI and update all the AI color and content extraction to use the new content. If you encounter any issues, refer to the troubleshooting section or check the application logs for more information.
