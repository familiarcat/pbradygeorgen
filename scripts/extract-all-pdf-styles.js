/**
 * Extract All PDF Styles
 *
 * This script runs all PDF extraction processes in sequence:
 * 1. Extract text content
 * 2. Extract colors
 * 3. Extract fonts
 *
 * It ensures that all style information is extracted and available for the application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// Define log function with Dante-inspired emoji logging
function log(type, message, colorCode) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`${timestamp} \x1b[${colorCode}m[${type}]\x1b[0m ${message}`);
}

/**
 * Process a PDF file
 *
 * @param {string} pdfPath Path to the PDF file
 * @returns {Promise<boolean>} Success status
 */
async function processPDF(pdfPath) {
  try {
    log('PDF', `Processing ${path.basename(pdfPath)}...`, '36'); // Cyan

    // Create the extracted directory if it doesn't exist
    const extractedDir = path.dirname(pdfPath) + '/extracted';
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
      log('INFO', `Created directory: ${extractedDir}`, '34'); // Blue
    }

    // Run the extraction scripts
    log('TEXT', 'Extracting text...', '34'); // Blue
    execSync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`, { stdio: 'inherit' });

    log('COLOR', 'Extracting colors...', '35'); // Magenta
    execSync(`node scripts/extract-pdf-colors.js "${pdfPath}"`, { stdio: 'inherit' });

    log('FONT', 'Extracting fonts...', '33'); // Yellow
    execSync(`node scripts/extract-pdf-fonts.js "${pdfPath}"`, { stdio: 'inherit' });

    log('DOCX', 'Updating DOCX template...', '36'); // Cyan
    execSync(`node scripts/update-docx-template.js`, { stdio: 'inherit' });

    // Verify that all files were created
    const requiredFiles = [
      path.join(extractedDir, 'resume_content.txt'),
      path.join(extractedDir, 'resume_content.md'),
      path.join(extractedDir, 'color_theory.json'),
      path.join(extractedDir, 'font_theory.json'),
      path.join(extractedDir, 'pdf_fonts.css'),
      path.join(process.cwd(), 'templates', 'reference.docx')
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    if (missingFiles.length > 0) {
      log('WARNING', `Missing files: ${missingFiles.join(', ')}`, '33'); // Yellow
    } else {
      log('SUCCESS', 'All required files were created successfully', '32'); // Green
    }

    log('COMPLETE', `PDF processing completed for ${path.basename(pdfPath)}`, '32'); // Green
    return true;
  } catch (error) {
    log('ERROR', `Failed to process PDF: ${error}`, '31'); // Red
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  log('START', 'Starting PDF style extraction', '1;36'); // Bright Cyan

  // Check if a file path was provided as a command-line argument
  const args = process.argv.slice(2);
  let pdfPath;

  if (args.length > 0) {
    // Use the provided file path
    pdfPath = args[0];
    log('INFO', `Using provided PDF path: ${pdfPath}`, '34'); // Blue
  } else {
    // Use the default file path
    pdfPath = path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
    log('INFO', `Using default PDF path: ${pdfPath}`, '34'); // Blue
  }

  // Check if the PDF file exists
  if (!fs.existsSync(pdfPath)) {
    log('ERROR', `PDF file not found: ${pdfPath}`, '31'); // Red
    process.exit(1);
  }

  // Process the PDF
  const success = await processPDF(pdfPath);

  if (success) {
    log('SUCCESS', 'PDF style extraction completed successfully', '32'); // Green
    process.exit(0);
  } else {
    log('ERROR', 'PDF style extraction failed', '31'); // Red
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  log('ERROR', `Unhandled error: ${error}`, '31'); // Red
  process.exit(1);
});
