/**
 * Unified PDF Extraction Module
 *
 * This module provides a unified interface for extracting information from PDF files.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');
const { extractText, generateImprovedMarkdown } = require('./text');
const { extractColors } = require('./colors');
const { extractFonts } = require('./fonts');
const { extractUserInfoFromPdf } = require('../extract-user-info');

const logger = createLogger('pdf');

/**
 * Extract all information from a PDF file
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extraction results
 */
async function extractAll(pdfPath, options = {}) {
  try {
    logger.info(`Starting extraction for ${pdfPath}`);

    // Validate the PDF path
    if (!fs.existsSync(pdfPath)) {
      logger.error(`PDF file not found: ${pdfPath}`);
      return {
        success: false,
        error: `PDF file not found: ${pdfPath}`
      };
    }

    // Create output directory
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);

    // Backup the original PDF if requested
    if (options.backup !== false && config.build.backupOriginalPdf) {
      const backupDir = path.join(process.cwd(), config.paths.backup);
      utils.backupFile(pdfPath, backupDir);
    }

    // Extract text
    logger.info('Extracting text...');
    const textResult = await extractText(pdfPath, { outputDir });

    // Extract colors
    logger.info('Extracting colors...');
    const colorResult = await extractColors(pdfPath, { outputDir });

    // Extract fonts
    logger.info('Extracting fonts...');
    const fontResult = await extractFonts(pdfPath, { outputDir });

    // Generate improved markdown if text was extracted successfully
    let markdownResult = null;
    if (textResult.success && (options.generateMarkdown !== false && config.build.generateImprovedMarkdown)) {
      logger.info('Generating improved markdown...');
      markdownResult = await generateImprovedMarkdown(textResult.outputPath, { outputDir });
    }

    // Extract user information if text was extracted successfully
    let userInfoResult = null;
    if (textResult.success && (options.extractUserInfo !== false && config.build.extractUserInfo !== false)) {
      logger.info('Extracting user information...');
      // Only show full user info on the first run
      const showFullFlag = options.showFullUserInfo === true;
      userInfoResult = await extractUserInfoFromPdf(textResult.outputPath, {
        outputDir,
        showFull: showFullFlag
      });
    }

    // Summarize the results
    const results = {
      success: textResult.success || colorResult.success || fontResult.success,
      text: textResult,
      colors: colorResult,
      fonts: fontResult,
      markdown: markdownResult,
      userInfo: userInfoResult,
      outputDir
    };

    // Log the results
    if (results.success) {
      logger.success(`PDF extraction completed successfully. Files saved to ${outputDir}`);
    } else {
      logger.warning('PDF extraction completed with some errors.');
    }

    return results;
  } catch (error) {
    logger.error(`Error extracting PDF: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Set a PDF as the default
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Options
 * @returns {Promise<Object>} - Result
 */
async function setDefaultPdf(pdfPath, options = {}) {
  try {
    logger.info(`Setting ${pdfPath} as the default PDF`);

    // Validate the PDF path
    if (!fs.existsSync(pdfPath)) {
      logger.error(`PDF file not found: ${pdfPath}`);
      return {
        success: false,
        error: `PDF file not found: ${pdfPath}`
      };
    }

    // Get the default PDF path
    const defaultPdfPath = path.join(process.cwd(), config.pdf.defaultPdf);

    // Backup the current default PDF if it exists
    if (fs.existsSync(defaultPdfPath)) {
      const backupDir = path.join(process.cwd(), config.paths.backup);
      utils.backupFile(defaultPdfPath, backupDir);
    }

    // Copy the new PDF to the default location
    fs.copyFileSync(pdfPath, defaultPdfPath);

    logger.success(`Set ${pdfPath} as the default PDF`);

    // Extract information from the new default PDF
    if (options.extract !== false) {
      logger.info('Extracting information from the new default PDF');
      return await extractAll(defaultPdfPath, options);
    }

    return {
      success: true,
      defaultPdfPath
    };
  } catch (error) {
    logger.error(`Error setting default PDF: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List available PDFs
 *
 * @returns {Object} - List of available PDFs
 */
function listPdfs() {
  try {
    logger.info('Listing available PDFs');

    const pdfs = {
      default: null,
      source: [],
      test: []
    };

    // Check for the default PDF
    const defaultPdfPath = path.join(process.cwd(), config.pdf.defaultPdf);
    if (fs.existsSync(defaultPdfPath)) {
      pdfs.default = {
        path: defaultPdfPath,
        name: path.basename(defaultPdfPath),
        size: fs.statSync(defaultPdfPath).size
      };
    }

    // Check for PDFs in the source directory
    const sourcePdfsDir = path.join(process.cwd(), config.paths.sourcePdfs);
    if (fs.existsSync(sourcePdfsDir)) {
      const sourceFiles = fs.readdirSync(sourcePdfsDir)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(file => {
          const filePath = path.join(sourcePdfsDir, file);
          return {
            path: filePath,
            name: file,
            size: fs.statSync(filePath).size
          };
        });

      pdfs.source = sourceFiles;
    }

    // Check for PDFs in the test directory
    const testPdfsDir = path.join(process.cwd(), config.paths.testPdfs);
    if (fs.existsSync(testPdfsDir)) {
      const testFiles = [];

      // Recursively find PDFs in the test directory
      function findPdfs(dir, baseDir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            findPdfs(filePath, baseDir);
          } else if (file.toLowerCase().endsWith('.pdf')) {
            const relativePath = path.relative(baseDir, filePath);
            testFiles.push({
              path: filePath,
              name: file,
              category: path.dirname(relativePath),
              size: stat.size
            });
          }
        }
      }

      findPdfs(testPdfsDir, testPdfsDir);
      pdfs.test = testFiles;
    }

    logger.success(`Found ${pdfs.source.length} source PDFs and ${pdfs.test.length} test PDFs`);

    return {
      success: true,
      pdfs
    };
  } catch (error) {
    logger.error(`Error listing PDFs: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  extractAll,
  extractText,
  extractColors,
  extractFonts,
  generateImprovedMarkdown,
  setDefaultPdf,
  listPdfs
};
