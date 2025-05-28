/**
 * True DOCX Generator
 * 
 * A server-side script that generates actual DOCX files using the docx-templates library.
 * This approach creates proper Microsoft Word documents without relying on HTML conversion.
 */

const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');
const { createLogger } = require('./core/logger');

// Create a logger for this module
const logger = createLogger('docx-generator');

/**
 * Generate a DOCX document from markdown content
 * 
 * @param {string} markdownContent - The markdown content to convert
 * @param {string} outputPath - Path to save the generated DOCX file
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Path to the generated DOCX file
 */
async function generateDocx(markdownContent, outputPath, options = {}) {
  try {
    logger.info(`Generating DOCX document: ${outputPath}`);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Get the template path
    const templatePath = path.join(__dirname, '..', 'templates', 'docx-template.docx');
    
    // If template doesn't exist, create a basic one
    if (!fs.existsSync(templatePath)) {
      logger.info('Template not found, using default template');
      
      // Use a buffer from a basic template
      const templateBuffer = fs.readFileSync(path.join(__dirname, '..', 'templates', 'basic-template.docx'));
      
      // Generate the report
      const buffer = await createReport({
        template: templateBuffer,
        data: {
          content: markdownContent,
          title: options.title || 'Document',
          author: options.author || 'AlexAI',
          date: new Date().toLocaleDateString()
        },
        cmdDelimiter: ['{{', '}}'],
      });
      
      // Write the buffer to the output file
      fs.writeFileSync(outputPath, buffer);
    } else {
      // Use the template file
      const template = fs.readFileSync(templatePath);
      
      // Generate the report
      const buffer = await createReport({
        template,
        data: {
          content: markdownContent,
          title: options.title || 'Document',
          author: options.author || 'AlexAI',
          date: new Date().toLocaleDateString()
        },
        cmdDelimiter: ['{{', '}}'],
      });
      
      // Write the buffer to the output file
      fs.writeFileSync(outputPath, buffer);
    }
    
    logger.info(`DOCX document generated successfully: ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error(`Error generating DOCX document: ${error.message}`);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node true-docx-generator.js <markdown-content> <output-path>');
    process.exit(1);
  }
  
  const markdownContent = args[0];
  const outputPath = args[1];
  
  generateDocx(markdownContent, outputPath)
    .then((path) => {
      console.log(`DOCX document generated: ${path}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
} else {
  // Export for use as a module
  module.exports = {
    generateDocx
  };
}
