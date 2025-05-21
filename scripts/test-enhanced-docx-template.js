/**
 * Test Enhanced DOCX Template
 * 
 * This script tests the enhanced DOCX template by generating a DOCX file
 * from existing markdown content using the template.
 * 
 * It follows the Dante philosophy of methodical organization with
 * appropriate emoji-based logging.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('./core/logger');
const buildSummary = require('./core/build-summary');

// Create a logger for this module
const logger = createLogger('test-docx-template');

/**
 * Test the enhanced DOCX template
 * 
 * @param {Object} options - Options for testing the template
 * @returns {Promise<string>} - Path to the generated test DOCX file
 */
async function testEnhancedDocxTemplate(options = {}) {
  try {
    logger.info('Testing enhanced DOCX template');
    buildSummary.startTask('build.docx.testTemplate');
    
    // Get paths
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    const markdownPath = options.markdownPath || path.join(extractedDir, 'resume_content_improved.md');
    const outputDir = options.outputDir || path.join(process.cwd(), 'temp');
    const outputPath = options.outputPath || path.join(outputDir, 'test-template.docx');
    const templatePath = options.templatePath || path.join(process.cwd(), 'templates', 'reference.docx');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Check if markdown file exists
    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Markdown file not found: ${markdownPath}`);
    }
    
    // Check if template file exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }
    
    // Use pandoc to convert markdown to DOCX using the template
    logger.info(`Converting markdown to DOCX using template: ${templatePath}`);
    const pandocCommand = `pandoc "${markdownPath}" -o "${outputPath}" --reference-doc="${templatePath}"`;
    execSync(pandocCommand, { stdio: 'inherit' });
    
    // Verify the file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error(`Failed to generate test DOCX file: ${outputPath}`);
    }
    
    logger.success(`Test DOCX file generated: ${outputPath}`);
    buildSummary.completeTask('build.docx.testTemplate');
    return outputPath;
  } catch (error) {
    logger.error(`Error testing enhanced DOCX template: ${error.message}`);
    buildSummary.failTask('build.docx.testTemplate', error.message);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  const markdownPath = args[0];
  const outputPath = args[1];
  
  testEnhancedDocxTemplate({ markdownPath, outputPath })
    .then((path) => {
      console.log(`Test DOCX file generated: ${path}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
} else {
  // Export for use as a module
  module.exports = {
    testEnhancedDocxTemplate
  };
}
