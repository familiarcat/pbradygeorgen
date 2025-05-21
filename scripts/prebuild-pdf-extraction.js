/**
 * Prebuild PDF Extraction Script
 *
 * This script runs before the build process to ensure that PDF extraction
 * is completed before any UI components are rendered. It extracts text,
 * colors, and fonts from the configured PDF source and creates the necessary
 * output files.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the extraction process
 * - Salinger: Ensuring an intuitive user experience with pre-loaded styles
 * - Derrida: Deconstructing hardcoded values with configurable options
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// We can't import the PDFProcessor here because it hasn't been compiled yet
// Instead, we'll use the existing extraction scripts directly

// Load the PDF source configuration
let pdfSourceConfig;
try {
  pdfSourceConfig = require('../pdf-source.config.js');
  console.log(`Loaded PDF source configuration (active: ${pdfSourceConfig.active})`);
} catch (error) {
  console.error('Failed to load PDF source configuration:', error);
  // Default configuration if the file doesn't exist
  pdfSourceConfig = {
    active: 'default',
    sources: {
      default: {
        path: 'public/pbradygeorgen_resume.pdf',
        outputPrefix: '',
        description: 'Default resume PDF'
      }
    }
  };
}

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
 * @param {string} outputPrefix Prefix for output files
 * @param {boolean} isActive Whether this is the active PDF source
 * @returns {Promise<boolean>} Success status
 */
async function processPDF(pdfPath, outputPrefix = '', isActive = false) {
  try {
    log('PDF', `Processing ${path.basename(pdfPath)}...`, colors.cyan);

    // Create output directory for this PDF if it doesn't exist
    const pdfOutputDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(pdfOutputDir)) {
      fs.mkdirSync(pdfOutputDir, { recursive: true });
    }

    // Run the extraction scripts with output prefix
    log('TEXT', 'Extracting text...', colors.blue);
    execSync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`, { stdio: 'inherit' });

    // Extract user information from the text content
    log('USER', 'Extracting user information...', colors.cyan);
    execSync(`node scripts/extract-user-info.js "public/extracted/resume_content.txt"`, { stdio: 'inherit' });

    log('COLOR', 'Extracting colors...', colors.magenta);
    execSync(`node scripts/extract-pdf-colors.js "${pdfPath}"`, { stdio: 'inherit' });

    log('FONT', 'Extracting fonts...', colors.yellow);
    execSync(`node scripts/extract-pdf-fonts.js "${pdfPath}"`, { stdio: 'inherit' });

    log('MARKDOWN', 'Generating improved markdown...', colors.green);
    execSync(`node scripts/generate-improved-markdown.js "public/extracted/resume_content.txt"`, { stdio: 'inherit' });

    // Generate introduction/summary content
    log('INTRO', 'Generating introduction content...', colors.cyan);
    execSync(`node scripts/generate-introduction.js "public/extracted/resume_content.md"`, { stdio: 'inherit' });

    // Generate resume content
    log('RESUME', 'Generating resume content...', colors.green);
    execSync(`node scripts/generate-resume.js "public/extracted/resume_content.md"`, { stdio: 'inherit' });

    // Generate DOCX files
    log('DOCX', 'Generating DOCX files...', colors.yellow);
    execSync(`node scripts/generate-docx-files.js`, { stdio: 'inherit' });

    // If this is the active PDF source, copy the output files to the standard locations
    if (isActive) {
      log('ACTIVE', `Processing active PDF: ${pdfPath}`, colors.green);

      // Copy color_theory.json to the standard location
      const colorTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'color_theory.json');
      if (fs.existsSync(colorTheoryPath)) {
        // Read the color theory JSON
        const colorTheory = JSON.parse(fs.readFileSync(colorTheoryPath, 'utf8'));

        // Save with the prefix
        fs.writeFileSync(
          path.join(process.cwd(), 'public', 'extracted', `${outputPrefix}color_theory.json`),
          JSON.stringify(colorTheory, null, 2)
        );

        // Also save as the standard color_theory.json for backward compatibility
        fs.writeFileSync(colorTheoryPath, JSON.stringify(colorTheory, null, 2));
      }

      // Copy font_theory.json to the standard location
      const fontTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'font_theory.json');
      if (fs.existsSync(fontTheoryPath)) {
        // Read the font theory JSON
        const fontTheory = JSON.parse(fs.readFileSync(fontTheoryPath, 'utf8'));

        // Save with the prefix
        fs.writeFileSync(
          path.join(process.cwd(), 'public', 'extracted', `${outputPrefix}font_theory.json`),
          JSON.stringify(fontTheory, null, 2)
        );

        // Also save as the standard font_theory.json for backward compatibility
        fs.writeFileSync(fontTheoryPath, JSON.stringify(fontTheory, null, 2));
      }

      // Create a PDF source identifier file to help with cache invalidation
      log('CACHE', 'Creating PDF source identifier for cache invalidation', colors.blue);
      try {
        execSync('node scripts/create-pdf-source-identifier.js', { stdio: 'inherit' });
        log('CACHE', 'PDF source identifier created successfully', colors.green);
      } catch (error) {
        log('ERROR', `Failed to create PDF source identifier: ${error.message}`, colors.red);
      }
    }

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

  // Get the active PDF source configuration
  const activeSource = pdfSourceConfig.active;
  const activeSourceConfig = pdfSourceConfig.sources[activeSource];

  if (!activeSourceConfig) {
    log('ERROR', `Active PDF source '${activeSource}' not found in configuration`, colors.red);
    process.exit(1);
  }

  log('CONFIG', `Loaded PDF source configuration (active: ${activeSource})`, colors.blue);

  // Process the active PDF source
  const activePdfPath = path.join(process.cwd(), activeSourceConfig.path);
  if (fs.existsSync(activePdfPath)) {
    log('ACTIVE', `Processing active PDF: ${activePdfPath}`, colors.green);
    await processPDF(activePdfPath, activeSourceConfig.outputPrefix, true);
  } else {
    log('ERROR', `Active PDF not found at ${activePdfPath}`, colors.red);
    process.exit(1);
  }

  // Process the default PDF if it's not the active one
  if (activeSource !== 'default') {
    const defaultConfig = pdfSourceConfig.sources.default;
    if (defaultConfig) {
      const defaultPdfPath = path.join(process.cwd(), defaultConfig.path);
      if (fs.existsSync(defaultPdfPath)) {
        log('DEFAULT', 'Processing default PDF...', colors.green);
        await processPDF(defaultPdfPath, defaultConfig.outputPrefix, false);
      } else {
        log('WARNING', 'Default PDF not found', colors.yellow);
      }
    }
  }

  // Process any other PDFs in the source-pdfs directory
  const sourcePdfsDir = path.join(process.cwd(), 'source-pdfs');
  if (fs.existsSync(sourcePdfsDir)) {
    const pdfFiles = fs.readdirSync(sourcePdfsDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => path.join(sourcePdfsDir, file))
      // Skip the active PDF if it's in the source-pdfs directory
      .filter(pdfPath => pdfPath !== activePdfPath);

    if (pdfFiles.length > 0) {
      log('SOURCE', `Found ${pdfFiles.length} additional PDFs in source-pdfs directory`, colors.blue);

      for (const pdfPath of pdfFiles) {
        // Find the source config for this PDF if it exists
        const sourceName = path.basename(pdfPath, path.extname(pdfPath));
        const sourceConfig = Object.values(pdfSourceConfig.sources).find(
          config => config.path === `source-pdfs/${sourceName}.pdf`
        );

        // Process the PDF with its prefix if configured, otherwise use the filename as prefix
        const outputPrefix = sourceConfig ? sourceConfig.outputPrefix : `${sourceName}_`;
        await processPDF(pdfPath, outputPrefix, false);
      }
    } else {
      log('INFO', 'No additional PDFs found in source-pdfs directory', colors.blue);
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
