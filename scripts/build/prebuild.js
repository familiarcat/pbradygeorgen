/**
 * Prebuild Script
 *
 * This script runs before the build process to ensure that PDF extraction
 * is completed before any UI components are rendered.
 *
 * It now includes enhanced extraction capabilities for better style theme extraction.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const { extractAll } = require('../pdf/extractor');
const { extractEnhanced } = require('../pdf/enhanced-extractor');

const logger = createLogger('build');

/**
 * Main prebuild function
 */
async function prebuild() {
  logger.info('Starting prebuild process');

  // Skip PDF extraction if disabled
  if (!config.build.prebuildExtraction) {
    logger.info('PDF extraction is disabled in config. Skipping.');
    return;
  }

  // Process the default PDF
  const defaultPdfPath = path.join(process.cwd(), config.pdf.defaultPdf);
  if (fs.existsSync(defaultPdfPath)) {
    logger.info(`Processing default PDF: ${defaultPdfPath}`);

    // Run standard extraction
    await extractAll(defaultPdfPath);

    // Run enhanced extraction
    logger.info(`Running enhanced extraction for default PDF`);
    await extractEnhanced(defaultPdfPath, {
      generateDocs: true
    });
  } else {
    logger.warning(`Default PDF not found: ${defaultPdfPath}`);
  }

  // Process any PDFs in the source-pdfs directory
  const sourcePdfsDir = path.join(process.cwd(), config.paths.sourcePdfs);
  if (fs.existsSync(sourcePdfsDir)) {
    const pdfFiles = fs.readdirSync(sourcePdfsDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => path.join(sourcePdfsDir, file));

    if (pdfFiles.length > 0) {
      logger.info(`Found ${pdfFiles.length} PDFs in source-pdfs directory`);

      for (const pdfPath of pdfFiles) {
        logger.info(`Processing source PDF: ${pdfPath}`);

        // Run standard extraction
        await extractAll(pdfPath);

        // Run enhanced extraction
        logger.info(`Running enhanced extraction for source PDF`);
        await extractEnhanced(pdfPath, {
          generateDocs: true
        });
      }
    } else {
      logger.info('No PDFs found in source-pdfs directory');
    }
  } else {
    logger.info('source-pdfs directory not found');
  }

  logger.success('Prebuild process completed successfully');
}

// Run the prebuild function
prebuild().catch(error => {
  logger.error(`Prebuild process failed: ${error.message}`);
  process.exit(1);
});
