/**
 * Prebuild Script
 *
 * This script runs before the build process to ensure that PDF extraction
 * and content generation are completed before any UI components are rendered.
 *
 * It includes:
 * - Enhanced extraction capabilities for better style theme extraction
 * - Professional introduction generation with balanced logical precision and authentic expression
 * - ATS optimization for modern hiring processes
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const { extractAll } = require('../pdf/extractor');
const { extractEnhanced } = require('../pdf/enhanced-extractor');
const { generateIntroduction } = require('../generate-professional-introduction');
const buildSummary = require('../core/build-summary');

const logger = createLogger('build');

/**
 * Main prebuild function
 */
async function prebuild() {
  logger.info('Starting prebuild process !!!!!!!!!');

  // Reset the build summary for a new build
  buildSummary.resetBuildSummary();

  // Start the build process
  buildSummary.startTask('build');

  // Skip PDF extraction if disabled
  if (!config.build.prebuildExtraction) {
    logger.info('PDF extraction is disabled in config. Skipping.');
    return;
  }

  // Process the default PDF
  const defaultPdfPath = path.join(process.cwd(), config.pdf.defaultPdf);
  if (fs.existsSync(defaultPdfPath)) {
    logger.info(`Processing default PDF: ${defaultPdfPath}`);

    // Run standard extraction with full user info display for the default PDF
    await extractAll(defaultPdfPath, {
      showFullUserInfo: true
    });

    // Run enhanced extraction
    logger.info(`Running enhanced extraction for default PDF`);
    await extractEnhanced(defaultPdfPath, {
      generateDocs: true
    });

    // Generate professional introduction
    const resumeContentPath = path.join(process.cwd(), 'public/extracted/resume_content.md');
    if (fs.existsSync(resumeContentPath)) {
      logger.info(`Generating professional introduction from resume content`);
      await generateIntroduction(resumeContentPath);
    } else {
      logger.warning(`Resume content not found: ${resumeContentPath}`);
    }
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

        // Run standard extraction without full user info display for source PDFs
        await extractAll(pdfPath, {
          showFullUserInfo: false
        });

        // Run enhanced extraction
        logger.info(`Running enhanced extraction for source PDF`);
        await extractEnhanced(pdfPath, {
          generateDocs: true
        });

        // Generate professional introduction
        const pdfBaseName = path.basename(pdfPath, '.pdf');
        const resumeContentPath = path.join(process.cwd(), `public/extracted/${pdfBaseName}_content.md`);
        if (fs.existsSync(resumeContentPath)) {
          logger.info(`Generating professional introduction from resume content for ${pdfBaseName}`);
          await generateIntroduction(resumeContentPath);
        } else {
          logger.warning(`Resume content not found: ${resumeContentPath}`);
        }
      }
    } else {
      logger.info('No PDFs found in source-pdfs directory');
    }
  } else {
    logger.info('source-pdfs directory not found');
  }

  // Mark build task as completed
  buildSummary.completeTask('build');

  // No need to display build summary here as it's updated in real-time

  logger.success('Prebuild process completed successfully');
}

// Run the prebuild function
prebuild().catch(error => {
  logger.error(`Prebuild process failed: ${error.message}`);
  process.exit(1);
});
