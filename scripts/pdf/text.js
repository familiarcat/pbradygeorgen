/**
 * PDF Text Extraction Module
 * 
 * This module extracts text content from PDF files.
 */

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');

const logger = createLogger('text');

/**
 * Extract text from a PDF file
 * 
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted text information
 */
async function extractText(pdfPath, options = {}) {
  try {
    logger.info(`Extracting text from PDF: ${pdfPath}`);
    
    // Load the PDF document
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    
    logger.info(`PDF loaded successfully. Number of pages: ${pdfDocument.numPages}`);
    
    // Extract text from each page
    let fullText = '';
    let pageTexts = [];
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      logger.info(`Processing page ${pageNum}/${pdfDocument.numPages}`);
      
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      let pageText = '';
      let lastY = null;
      
      for (const item of textContent.items) {
        if (lastY !== item.transform[5] && pageText !== '') {
          // New line
          pageText += '\n';
        }
        
        pageText += item.str;
        lastY = item.transform[5];
      }
      
      pageTexts.push(pageText);
      fullText += pageText + '\n\n';
    }
    
    // Clean up the text
    fullText = cleanText(fullText);
    
    // Save the extracted text
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);
    
    const outputPath = path.join(outputDir, 'resume_content.txt');
    utils.saveText(outputPath, fullText);
    
    logger.success(`Text content saved to: ${outputPath}`);
    
    return {
      success: true,
      text: fullText,
      pageTexts,
      outputPath
    };
  } catch (error) {
    logger.error(`Error extracting text: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clean extracted text
 * 
 * @param {string} text - The text to clean
 * @returns {string} - The cleaned text
 */
function cleanText(text) {
  // Replace multiple spaces with a single space
  let cleanedText = text.replace(/\s+/g, ' ');
  
  // Replace multiple newlines with a single newline
  cleanedText = cleanedText.replace(/\n+/g, '\n');
  
  // Trim whitespace
  cleanedText = cleanedText.trim();
  
  return cleanedText;
}

/**
 * Generate improved markdown from text content
 * 
 * @param {string} textPath - Path to the text file
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generation result
 */
async function generateImprovedMarkdown(textPath, options = {}) {
  try {
    logger.info(`Generating improved markdown from: ${textPath}`);
    
    // Read the text file
    const text = fs.readFileSync(textPath, 'utf8');
    
    // Try to analyze with OpenAI if available
    let markdown = '';
    
    if (process.env.OPENAI_API_KEY) {
      try {
        const { analyzeTextWithOpenAI } = require('../openai/analyzer');
        const result = await analyzeTextWithOpenAI(text);
        
        if (result && result.markdown) {
          logger.info('Using OpenAI markdown generation');
          markdown = result.markdown;
        } else {
          logger.warning('OpenAI markdown generation failed. Falling back to local generation.');
          markdown = generateMarkdownLocally(text);
        }
      } catch (error) {
        logger.error(`Error analyzing text with OpenAI: ${error.message}`);
        logger.info('Falling back to local markdown generation');
        markdown = generateMarkdownLocally(text);
      }
    } else {
      logger.info('OpenAI API key not found. Using local markdown generation.');
      markdown = generateMarkdownLocally(text);
    }
    
    // Save the markdown
    const outputDir = options.outputDir || path.dirname(textPath);
    const outputPath = path.join(outputDir, 'resume_content_improved.md');
    
    utils.saveText(outputPath, markdown);
    
    logger.success(`Improved markdown saved to: ${outputPath}`);
    
    return {
      success: true,
      markdown,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating improved markdown: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate markdown locally without OpenAI
 * 
 * @param {string} text - The text to convert to markdown
 * @returns {string} - The markdown text
 */
function generateMarkdownLocally(text) {
  logger.info('Generating markdown locally');
  
  // Split the text into lines
  const lines = text.split('\n');
  
  // Process the lines
  let markdown = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') {
      markdown += '\n';
      inList = false;
      continue;
    }
    
    // Check if the line is a heading
    if (line.toUpperCase() === line && line.length > 3 && !line.includes(':')) {
      markdown += `## ${line}\n\n`;
      continue;
    }
    
    // Check if the line is a subheading
    if (i > 0 && lines[i - 1].toUpperCase() === lines[i - 1] && line.length > 3) {
      markdown += `### ${line}\n\n`;
      continue;
    }
    
    // Check if the line is a list item
    if (line.match(/^[•\-\*\–]\s/) || line.match(/^\d+\.\s/)) {
      if (!inList) {
        markdown += '\n';
        inList = true;
      }
      
      // Convert bullet points
      const listItem = line.replace(/^[•\-\*\–]\s/, '- ').replace(/^\d+\.\s/, '1. ');
      markdown += `${listItem}\n`;
      continue;
    }
    
    // Regular paragraph
    if (inList) {
      markdown += '\n';
      inList = false;
    }
    
    markdown += `${line}\n\n`;
  }
  
  return markdown;
}

module.exports = {
  extractText,
  generateImprovedMarkdown
};
