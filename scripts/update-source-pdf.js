/**
 * Source PDF Update Manager
 *
 * This script manages the source PDF files for the AlexAI application.
 * It allows updating the source PDF and ensures it's properly integrated
 * with the entire build process, including S3 storage and OpenAI processing.
 *
 * Following Derrida's philosophy of deconstruction, this script breaks down the PDF
 * management process into discrete, analyzable components.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Configuration
const PDF_NAMES = {
  PRIMARY: 'default_resume.pdf',
  LEGACY: 'pbradygeorgen_resume.pdf'
};

const SOURCE_DIR = path.join(process.cwd(), 'source-pdfs');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PRIMARY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.PRIMARY);
const LEGACY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.LEGACY);

/**
 * Lists all available source PDFs
 */
function listSourcePdfs() {
  log.info('Listing available source PDFs...');

  // Create source directory if it doesn't exist
  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    log.info('Created source-pdfs directory.');
  }

  // Get all PDF files in the source directory
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.toLowerCase().endsWith('.pdf'));

  if (files.length === 0) {
    log.warning('No source PDFs found in source-pdfs directory.');
    return [];
  }

  log.info(`Found ${files.length} source PDFs:`);
  files.forEach((file, index) => {
    const stats = fs.statSync(path.join(SOURCE_DIR, file));
    const sizeInKB = Math.round(stats.size / 1024);
    log.info(`${index + 1}. ${file} (${sizeInKB} KB)`);
  });

  return files;
}

/**
 * Updates the source PDF with a new file
 */
function updateSourcePdf(sourcePdfPath) {
  log.info(`Updating source PDF with: ${sourcePdfPath}`);

  // Validate the source PDF path
  if (!fs.existsSync(sourcePdfPath)) {
    log.error(`Source PDF not found: ${sourcePdfPath}`);
    process.exit(1);
  }

  // Create backup of current PDFs
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(SOURCE_DIR, 'backups', timestamp);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Backup current PDFs if they exist
  if (fs.existsSync(PRIMARY_PDF_PATH)) {
    const backupPath = path.join(backupDir, PDF_NAMES.PRIMARY);
    fs.copyFileSync(PRIMARY_PDF_PATH, backupPath);
    log.success(`Backed up current primary PDF to: ${backupPath}`);
  }

  if (fs.existsSync(LEGACY_PDF_PATH)) {
    const backupPath = path.join(backupDir, PDF_NAMES.LEGACY);
    fs.copyFileSync(LEGACY_PDF_PATH, backupPath);
    log.success(`Backed up current legacy PDF to: ${backupPath}`);
  }

  // Copy the new PDF to both primary and legacy locations
  fs.copyFileSync(sourcePdfPath, PRIMARY_PDF_PATH);
  fs.copyFileSync(sourcePdfPath, LEGACY_PDF_PATH);

  log.success(`Updated primary PDF: ${PRIMARY_PDF_PATH}`);
  log.success(`Updated legacy PDF: ${LEGACY_PDF_PATH}`);

  // Also save a copy in the source-pdfs directory if it's not already there
  const sourcePdfFilename = path.basename(sourcePdfPath);
  const destinationPath = path.join(SOURCE_DIR, sourcePdfFilename);
  
  if (sourcePdfPath !== destinationPath && !fs.existsSync(destinationPath)) {
    fs.copyFileSync(sourcePdfPath, destinationPath);
    log.success(`Saved a copy to source-pdfs directory: ${destinationPath}`);
  }

  return { primary: PRIMARY_PDF_PATH, legacy: LEGACY_PDF_PATH };
}

/**
 * Processes the updated PDF files
 */
function processPdfs() {
  log.info('Processing updated PDF files...');

  try {
    // Run the PDF reference manager script
    execSync('node scripts/manage-pdf-references.js', { stdio: 'inherit' });
    log.success('PDF processing completed successfully.');
    return true;
  } catch (error) {
    log.error(`Error processing PDFs: ${error.message}`);
    return false;
  }
}

/**
 * Updates the build configuration to use the new PDF
 */
function updateBuildConfig() {
  log.info('Updating build configuration...');

  // Create a build info file in the extracted directory
  const extractedDir = path.join(PUBLIC_DIR, 'extracted');
  if (!fs.existsSync(extractedDir)) {
    fs.mkdirSync(extractedDir, { recursive: true });
  }

  const buildInfoPath = path.join(extractedDir, 'build_info.json');
  const buildInfo = {
    sourcePdf: PDF_NAMES.PRIMARY,
    lastUpdated: new Date().toISOString(),
    buildMode: 'development',
    processedWithOpenAI: true
  };

  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  log.success(`Updated build configuration: ${buildInfoPath}`);
}

/**
 * Main function
 */
function main() {
  log.info('Starting source PDF update process...');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list') {
    // List available source PDFs
    listSourcePdfs();
  } else if (command === 'update') {
    // Update the source PDF
    const sourcePdfPath = args[1];
    
    if (!sourcePdfPath) {
      log.error('No source PDF path provided. Usage: node scripts/update-source-pdf.js update <path-to-pdf>');
      process.exit(1);
    }

    // Update the source PDF
    updateSourcePdf(sourcePdfPath);
    
    // Process the updated PDFs
    const success = processPdfs();
    
    if (success) {
      // Update the build configuration
      updateBuildConfig();
      log.success('Source PDF update process completed successfully.');
    } else {
      log.error('Source PDF update process failed during PDF processing.');
      process.exit(1);
    }
  } else {
    // Show usage information
    log.info('Usage:');
    log.info('  node scripts/update-source-pdf.js list');
    log.info('  node scripts/update-source-pdf.js update <path-to-pdf>');
  }
}

// Execute main function
main();
