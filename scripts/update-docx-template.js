/**
 * Update DOCX Template
 * 
 * This script updates the reference.docx template whenever PDF styles are extracted.
 * It integrates with the PDF extraction process to ensure the DOCX styling
 * always matches the PDF.
 * 
 * It follows the Hesse philosophy of mathematical color theory and
 * the Müller-Brockmann philosophy of grid-based layouts and clear typography.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('./core/logger');
const { generateEnhancedDocxTemplate } = require('./generate-enhanced-docx-template');
const buildSummary = require('./core/build-summary');

// Create a logger for this module
const logger = createLogger('update-docx-template');

/**
 * Update the DOCX template based on extracted PDF styles
 * 
 * @param {Object} options - Options for updating the template
 * @returns {Promise<string>} - Path to the updated template
 */
async function updateDocxTemplate(options = {}) {
  try {
    logger.info('Updating DOCX template based on extracted PDF styles');
    buildSummary.startTask('build.docx.updateTemplate');
    
    // Generate the enhanced DOCX template
    const templatePath = await generateEnhancedDocxTemplate({
      outputFile: options.outputFile || 'reference.docx',
      keepTemp: options.keepTemp
    });
    
    logger.success(`DOCX template updated: ${templatePath}`);
    buildSummary.completeTask('build.docx.updateTemplate');
    return templatePath;
  } catch (error) {
    logger.error(`Error updating DOCX template: ${error.message}`);
    buildSummary.failTask('build.docx.updateTemplate', error.message);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  const outputFile = args[0] || 'reference.docx';
  
  updateDocxTemplate({ outputFile })
    .then((path) => {
      console.log(`DOCX template updated: ${path}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
} else {
  // Export for use as a module
  module.exports = {
    updateDocxTemplate
  };
}
