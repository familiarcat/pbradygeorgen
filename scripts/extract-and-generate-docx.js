/**
 * Extract and Generate DOCX
 * 
 * This script extracts enhanced user information from a PDF file using ATS techniques
 * and generates a Microsoft Word (.docx) document from the extracted content.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./core/logger');
const { extractEnhancedUserInfo } = require('./extract-enhanced-user-info');
const { generateDocxFromMarkdown } = require('./generate-docx');
const buildSummary = require('./core/build-summary');

// Create a logger for this script
const logger = createLogger('extract-docx');

/**
 * Main function
 */
async function main() {
  try {
    // Get the PDF path from command line arguments
    const pdfPath = process.argv[2] || path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      logger.error(`PDF file not found: ${pdfPath}`);
      process.exit(1);
    }

    logger.info(`Processing PDF: ${pdfPath}`);
    buildSummary.startTask('build.extract-docx');

    // Extract enhanced user information
    logger.info('Extracting enhanced user information...');
    buildSummary.startTask('build.extract-docx.ats');
    const userInfo = await extractEnhancedUserInfo(pdfPath);
    buildSummary.completeTask('build.extract-docx.ats');

    // Get the markdown path
    const markdownPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_improved.md');
    
    if (!fs.existsSync(markdownPath)) {
      logger.error(`Markdown file not found: ${markdownPath}`);
      process.exit(1);
    }

    // Generate DOCX document
    logger.info('Generating DOCX document...');
    buildSummary.startTask('build.extract-docx.docx');
    const docxPath = await generateDocxFromMarkdown(markdownPath, {
      title: userInfo.fullName || 'Resume',
      creator: userInfo.fullName || 'AlexAI',
      description: `Resume for ${userInfo.fullName || 'User'}`,
      outputPath: path.join(process.cwd(), 'public', 'extracted', `${userInfo.filePrefix || 'resume'}.docx`)
    });
    buildSummary.completeTask('build.extract-docx.docx');

    logger.success(`DOCX document generated: ${docxPath}`);
    buildSummary.completeTask('build.extract-docx');
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    buildSummary.failTask('build.extract-docx', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
