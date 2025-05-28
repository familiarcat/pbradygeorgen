/**
 * Simple DOCX Generator
 * 
 * A simplified approach to generating Microsoft Word documents from markdown content.
 * This script uses the mammoth library to convert HTML to DOCX format.
 * 
 * Following Occam's razor principle: the simplest solution is often the best.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const officegen = require('officegen');
const { createLogger } = require('./core/logger');
const utils = require('./core/utils');
const buildSummary = require('./core/build-summary');

// Create a logger for this module
const logger = createLogger('simple-docx');

/**
 * Generate a DOCX document from markdown content
 * 
 * @param {string} markdownPath - Path to the markdown file or markdown content
 * @param {string} outputPath - Path to save the generated DOCX file
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Path to the generated DOCX file
 */
async function generateDocx(markdownPath, outputPath, options = {}) {
  logger.info(`Generating DOCX document: ${outputPath}`);
  buildSummary.startTask('build.docx');

  try {
    // Determine if markdownPath is a file path or content
    let markdownContent;
    if (fs.existsSync(markdownPath)) {
      logger.info(`Reading markdown from file: ${markdownPath}`);
      markdownContent = fs.readFileSync(markdownPath, 'utf8');
    } else {
      logger.info('Using provided markdown content');
      markdownContent = markdownPath;
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    utils.ensureDir(outputDir);

    // Convert markdown to HTML
    const html = marked(markdownContent);

    // Create a new DOCX document
    const docx = officegen('docx');

    // Set document properties
    docx.setDocSubject(options.subject || 'Generated Document');
    docx.setDocTitle(options.title || 'Document');
    docx.setDocAuthor(options.author || 'AlexAI');

    // Create a simple style for the document
    const defaultStyle = {
      font_face: options.fontFace || 'Arial',
      font_size: options.fontSize || 11
    };

    // Split HTML into paragraphs
    const paragraphs = html
      .replace(/<p>/g, '||PARAGRAPH_START||')
      .replace(/<\/p>/g, '||PARAGRAPH_END||')
      .replace(/<h1>/g, '||H1_START||')
      .replace(/<\/h1>/g, '||H1_END||')
      .replace(/<h2>/g, '||H2_START||')
      .replace(/<\/h2>/g, '||H2_END||')
      .replace(/<h3>/g, '||H3_START||')
      .replace(/<\/h3>/g, '||H3_END||')
      .replace(/<ul>/g, '||UL_START||')
      .replace(/<\/ul>/g, '||UL_END||')
      .replace(/<ol>/g, '||OL_START||')
      .replace(/<\/ol>/g, '||OL_END||')
      .replace(/<li>/g, '||LI_START||')
      .replace(/<\/li>/g, '||LI_END||')
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .split('||');

    let inList = false;
    let listType = '';

    // Process each paragraph
    for (let i = 0; i < paragraphs.length; i++) {
      const part = paragraphs[i];

      if (part === 'PARAGRAPH_START') {
        // Start a new paragraph
        const text = paragraphs[i + 1];
        if (text && text !== 'PARAGRAPH_END') {
          const p = docx.createP();
          p.addText(text, defaultStyle);
        }
        i++; // Skip the next part (content)
      } else if (part === 'H1_START') {
        // Add a heading 1
        const text = paragraphs[i + 1];
        if (text && text !== 'H1_END') {
          const p = docx.createP();
          p.addText(text, { ...defaultStyle, bold: true, font_size: 16 });
          p.addLineBreak();
        }
        i++; // Skip the next part (content)
      } else if (part === 'H2_START') {
        // Add a heading 2
        const text = paragraphs[i + 1];
        if (text && text !== 'H2_END') {
          const p = docx.createP();
          p.addText(text, { ...defaultStyle, bold: true, font_size: 14 });
          p.addLineBreak();
        }
        i++; // Skip the next part (content)
      } else if (part === 'H3_START') {
        // Add a heading 3
        const text = paragraphs[i + 1];
        if (text && text !== 'H3_END') {
          const p = docx.createP();
          p.addText(text, { ...defaultStyle, bold: true, font_size: 12 });
          p.addLineBreak();
        }
        i++; // Skip the next part (content)
      } else if (part === 'UL_START') {
        inList = true;
        listType = 'ul';
      } else if (part === 'OL_START') {
        inList = true;
        listType = 'ol';
      } else if (part === 'UL_END' || part === 'OL_END') {
        inList = false;
        listType = '';
      } else if (part === 'LI_START') {
        // Add a list item
        const text = paragraphs[i + 1];
        if (text && text !== 'LI_END') {
          const p = docx.createP();
          
          if (listType === 'ul') {
            p.addText('• ', defaultStyle);
          } else if (listType === 'ol') {
            // For simplicity, we're not tracking the actual number
            p.addText('1. ', defaultStyle);
          }
          
          p.addText(text, defaultStyle);
        }
        i++; // Skip the next part (content)
      }
    }

    // Generate the DOCX file
    return new Promise((resolve, reject) => {
      const out = fs.createWriteStream(outputPath);
      
      out.on('error', (err) => {
        logger.error(`Error writing DOCX file: ${err.message}`);
        buildSummary.failTask('build.docx', err.message);
        reject(err);
      });
      
      out.on('close', () => {
        logger.success(`DOCX document generated and saved to: ${outputPath}`);
        buildSummary.completeTask('build.docx');
        resolve(outputPath);
      });
      
      docx.generate(out);
    });
  } catch (error) {
    logger.error(`Error generating DOCX document: ${error.message}`);
    buildSummary.failTask('build.docx', error.message);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node simple-docx-generator.js <markdown-path> <output-path>');
    process.exit(1);
  }
  
  const markdownPath = args[0];
  const outputPath = args[1];
  
  generateDocx(markdownPath, outputPath)
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
