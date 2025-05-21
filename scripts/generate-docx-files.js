/**
 * Generate DOCX Files
 * 
 * This script pre-generates Microsoft Word (.docx) files during the build phase.
 * It follows the same pattern as other file generation scripts to ensure consistency.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { createLogger } = require('./core/logger');
const utils = require('./core/utils');
const buildSummary = require('./core/build-summary');

// Promisify exec
const execAsync = promisify(exec);

// Create a logger for this module
const logger = createLogger('docx-generator');

/**
 * Generate DOCX files from markdown content
 */
async function generateDocxFiles() {
  logger.info('Generating DOCX files');
  buildSummary.startTask('build.docx');

  try {
    // Ensure the extracted directory exists
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    utils.ensureDir(extractedDir);

    // Generate resume.docx
    await generateDocxFile(
      path.join(extractedDir, 'resume.md'),
      path.join(extractedDir, 'resume.docx'),
      'Resume'
    );

    // Generate introduction.docx
    await generateDocxFile(
      path.join(extractedDir, 'introduction.md'),
      path.join(extractedDir, 'introduction.docx'),
      'Introduction'
    );

    buildSummary.completeTask('build.docx');
    logger.success('DOCX files generated successfully');
  } catch (error) {
    buildSummary.failTask('build.docx', error.message);
    logger.error(`Error generating DOCX files: ${error.message}`);
    throw error;
  }
}

/**
 * Generate a DOCX file from a markdown file
 * 
 * @param {string} markdownPath - Path to the markdown file
 * @param {string} outputPath - Path to save the generated DOCX file
 * @param {string} documentType - Type of document (Resume or Introduction)
 * @returns {Promise<void>}
 */
async function generateDocxFile(markdownPath, outputPath, documentType) {
  try {
    // Check if the markdown file exists
    if (!fs.existsSync(markdownPath)) {
      logger.warn(`Markdown file not found: ${markdownPath}`);
      return;
    }

    logger.info(`Generating ${documentType} DOCX file: ${outputPath}`);

    // Use pandoc to convert markdown to DOCX
    try {
      // Create a reference.docx file if it doesn't exist
      const referenceDocxPath = path.join(process.cwd(), 'templates', 'reference.docx');
      
      if (!fs.existsSync(referenceDocxPath)) {
        logger.info('Creating reference.docx template');
        utils.ensureDir(path.dirname(referenceDocxPath));
        
        // Create a simple reference.docx file
        await execAsync(`pandoc -o "${referenceDocxPath}" --print-default-data-file reference.docx`);
      }

      // Convert markdown to DOCX using pandoc
      const pandocCommand = `pandoc "${markdownPath}" -o "${outputPath}" --reference-doc="${referenceDocxPath}"`;
      logger.info(`Running pandoc command: ${pandocCommand}`);
      
      await execAsync(pandocCommand);
      
      // Verify the file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error(`Pandoc did not create the output file: ${outputPath}`);
      }
      
      // Log file size for debugging
      const stats = fs.statSync(outputPath);
      logger.info(`Generated DOCX file size: ${stats.size} bytes`);
      
      if (stats.size < 100) {
        throw new Error(`Generated DOCX file is too small (${stats.size} bytes), likely invalid`);
      }
      
      logger.success(`${documentType} DOCX file generated successfully: ${outputPath}`);
    } catch (error) {
      // If pandoc fails, create a simple HTML file that can be opened in Word
      logger.warn(`Pandoc failed: ${error.message}. Creating HTML fallback.`);
      
      // Read the markdown content
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      
      // Create a simple HTML file that can be opened in Word
      const htmlOutputPath = outputPath.replace('.docx', '.html');
      
      // Create a Word-compatible HTML document
      const wordHtml = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${documentType}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            /* Default styles */
            body {
              font-family: 'Calibri', sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              margin: 1in;
            }
            h1 { font-size: 16pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            p { margin-top: 0pt; margin-bottom: 8pt; }
            ul, ol { margin-top: 0pt; margin-bottom: 8pt; }
            li { margin-bottom: 4pt; }
          </style>
        </head>
        <body>
          ${markdownContent
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')}
        </body>
        </html>
      `;
      
      // Write the HTML file
      fs.writeFileSync(htmlOutputPath, wordHtml);
      
      logger.info(`${documentType} HTML fallback file generated: ${htmlOutputPath}`);
    }
  } catch (error) {
    logger.error(`Error generating ${documentType} DOCX file: ${error.message}`);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  generateDocxFiles()
    .then(() => {
      console.log('DOCX files generated successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
} else {
  // Export for use as a module
  module.exports = {
    generateDocxFiles
  };
}
