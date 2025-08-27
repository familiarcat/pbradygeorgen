/**
 * Prebuild PDF Extraction Script
 *
 * This script runs before the build process to ensure that PDF extraction
 * is completed before any UI components are rendered. It extracts text,
 * colors, and fonts from the default PDF and any other PDFs in the source-pdfs
 * directory.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the extraction process
 * - Salinger: Ensuring an intuitive user experience with pre-loaded styles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// We can't import the PDFProcessor here because it hasn't been compiled yet
// Instead, we'll use the existing extraction scripts directly

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Log a message with a prefix and color
 *
 * @param {string} prefix Message prefix
 * @param {string} message Message content
 * @param {string} color ANSI color code
 */
function log(prefix, message, color = colors.reset) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset} ${message}`);
}

/**
 * Process a PDF file
 *
 * @param {string} pdfPath Path to the PDF file
 * @returns {Promise<boolean>} Success status
 */
async function processPDF(pdfPath) {
  try {
    log('PDF', `Processing ${path.basename(pdfPath)}...`, colors.cyan);

    // Run the extraction scripts
    log('TEXT', 'Extracting text...', colors.blue);
    execSync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`, { stdio: 'inherit' });

    log('COLOR', 'Extracting colors...', colors.magenta);
    execSync(`node scripts/extract-pdf-colors.js "${pdfPath}"`, { stdio: 'inherit' });

    log('FONT', 'Extracting fonts...', colors.yellow);
    execSync(`node scripts/extract-pdf-fonts.js "${pdfPath}"`, { stdio: 'inherit' });

    log('MARKDOWN', 'Generating improved markdown...', colors.green);
    execSync(`node scripts/generate-improved-markdown.js "public/extracted/resume_content.txt"`, { stdio: 'inherit' });

    log('SUCCESS', `Processed ${path.basename(pdfPath)}`, colors.green);
    return true;
  } catch (error) {
    log('ERROR', `Failed to process ${path.basename(pdfPath)}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  log('PREBUILD', 'Starting PDF extraction before build', colors.bright + colors.cyan);

  // Create the extracted directory if it doesn't exist
  const extractedDir = path.join(process.cwd(), 'public', 'extracted');
  if (!fs.existsSync(extractedDir)) {
    fs.mkdirSync(extractedDir, { recursive: true });
  }

  // Process the default PDF
  const defaultPdfPath = path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
  if (fs.existsSync(defaultPdfPath)) {
    log('DEFAULT', 'Processing default PDF...', colors.green);
    await processPDF(defaultPdfPath);
  } else {
    log('WARNING', 'Default PDF not found', colors.yellow);
  }

  // Process any PDFs in the source-pdfs directory
  const sourcePdfsDir = path.join(process.cwd(), 'source-pdfs');
  if (fs.existsSync(sourcePdfsDir)) {
    const pdfFiles = fs.readdirSync(sourcePdfsDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => path.join(sourcePdfsDir, file));

    if (pdfFiles.length > 0) {
      log('SOURCE', `Found ${pdfFiles.length} PDFs in source-pdfs directory`, colors.blue);

      for (const pdfPath of pdfFiles) {
        await processPDF(pdfPath);
      }
    } else {
      log('INFO', 'No PDFs found in source-pdfs directory', colors.blue);
    }
  } else {
    log('INFO', 'source-pdfs directory not found', colors.blue);
  }

  log('COMPLETE', 'PDF extraction completed', colors.bright + colors.green);
}

// Run the main function
main().catch(error => {
  log('ERROR', `Prebuild PDF extraction failed: ${error.message}`, colors.red);
  process.exit(1);
});
