/**
 * Test PDF Template Script
 *
 * This script allows testing different PDF templates by:
 * 1. Copying a test PDF to the public directory
 * 2. Extracting its content
 * 3. Generating the necessary files for the application to process
 *
 * Usage: node scripts/test-pdf-template.js [pdf-file-path]
 * Example: node scripts/test-pdf-template.js ./public/test-pdfs/template1.pdf
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the PDF path from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide a path to a PDF file');
  console.error('Usage: node scripts/test-pdf-template.js [pdf-file-path]');
  process.exit(1);
}

const sourcePdfPath = args[0];
if (!fs.existsSync(sourcePdfPath)) {
  console.error(`File not found: ${sourcePdfPath}`);
  process.exit(1);
}

// Extract the filename
const pdfFilename = path.basename(sourcePdfPath);

// Main function
async function main() {
  try {
    console.log(`Testing PDF template: ${pdfFilename}`);

    // 1. Create a backup of the original PDF
    const originalPdfPath = path.join(__dirname, '../public/default_resume.pdf');
    const backupPdfPath = path.join(__dirname, '../public/default_resume.backup.pdf');

    if (!fs.existsSync(backupPdfPath)) {
      console.log('Creating backup of original PDF...');
      fs.copyFileSync(originalPdfPath, backupPdfPath);
    }

    // 2. Copy the test PDF to the public directory
    console.log('Copying test PDF to public directory...');
    fs.copyFileSync(sourcePdfPath, originalPdfPath);

    // 3. Extract content from the PDF
    console.log('Extracting content from PDF...');
    try {
      // Try to run the improved extraction script
      execSync('node scripts/extract-pdf-text-improved.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Improved extraction failed, trying alternative method...');
      try {
        // Try the pdf-parse method
        execSync('node scripts/extract-pdf-text-with-pdf-parse.js', { stdio: 'inherit' });
      } catch (error2) {
        console.log('PDF-parse extraction failed, trying simple method...');
        // Try the simple method
        execSync('node scripts/extract-pdf-text-simple.js', { stdio: 'inherit' });
      }
    }

    // 4. Generate improved markdown content
    console.log('Generating improved markdown content...');
    try {
      // Try to run the OpenAI analysis
      execSync('node scripts/generate-improved-markdown.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to generate improved markdown. You may need to run the app and use the API directly.');
    }

    console.log('\nTest PDF setup complete!');
    console.log('You can now run the application to see how it handles the new template:');
    console.log('npm run dev');
    console.log('\nTo restore the original PDF:');
    console.log('node scripts/restore-original-pdf.js');

  } catch (error) {
    console.error('Error testing PDF template:', error);
    process.exit(1);
  }
}

// Run the main function
main();
