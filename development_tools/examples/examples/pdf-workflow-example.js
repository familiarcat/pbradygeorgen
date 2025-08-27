#!/usr/bin/env node

/**
 * PDF Workflow Example
 * 
 * This script demonstrates how to use the PDF selection and management system programmatically.
 * It selects a PDF file, extracts content, tests the extraction, and builds the application.
 * 
 * Usage:
 *   node examples/pdf-workflow-example.js [pdf-path]
 * 
 * If no PDF path is provided, the script will use the default PDF.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Log a message with a prefix and color
 * 
 * @param {string} prefix Message prefix
 * @param {string} message Message content
 * @param {string} color ANSI color code
 */
function log(prefix, message, color = colors.reset) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset} ${message}`);
}

/**
 * Run a command and log the output
 * 
 * @param {string} command Command to run
 * @param {string} description Description of the command
 * @returns {boolean} Success status
 */
function runCommand(command, description) {
  log('RUN', description, colors.blue);
  console.log(`$ ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    log('SUCCESS', 'Command completed successfully', colors.green);
    return true;
  } catch (error) {
    log('ERROR', `Command failed with exit code ${error.status}`, colors.red);
    return false;
  }
}

/**
 * Find all PDF files in the public folder and source-pdfs directory
 * 
 * @returns {string[]} Array of PDF file paths
 */
function findPDFs() {
  log('FIND', 'Finding PDF files', colors.blue);
  
  const pdfFiles = [];
  
  // Find PDFs in the public folder
  const publicPDFs = execSync('find public -name "*.pdf"').toString().trim().split('\n');
  pdfFiles.push(...publicPDFs);
  
  // Find PDFs in the source-pdfs directory
  try {
    const sourcePDFs = execSync('find source-pdfs -name "*.pdf"').toString().trim().split('\n');
    pdfFiles.push(...sourcePDFs.filter(pdf => pdf));
  } catch (error) {
    // source-pdfs directory might not exist
  }
  
  log('FOUND', `Found ${pdfFiles.length} PDF files`, colors.green);
  
  return pdfFiles;
}

/**
 * Select a PDF file
 * 
 * @param {string} pdfPath Path to the PDF file
 * @returns {boolean} Success status
 */
function selectPDF(pdfPath) {
  log('SELECT', `Selecting PDF: ${pdfPath}`, colors.blue);
  
  return runCommand(`npm run pdf:set-default "${pdfPath}"`, `Setting ${pdfPath} as the default PDF`);
}

/**
 * Test PDF extraction
 * 
 * @returns {boolean} Success status
 */
function testPDFExtraction() {
  log('TEST', 'Testing PDF extraction', colors.blue);
  
  return runCommand('npm run test:pdf-extraction', 'Testing PDF extraction');
}

/**
 * Build the application
 * 
 * @returns {boolean} Success status
 */
function buildApplication() {
  log('BUILD', 'Building the application', colors.blue);
  
  return runCommand('npm run build', 'Building the application');
}

/**
 * Display the extracted content
 */
function displayExtractedContent() {
  log('DISPLAY', 'Displaying extracted content', colors.blue);
  
  try {
    // Display color theory
    const colorTheory = JSON.parse(fs.readFileSync('public/extracted/color_theory.json', 'utf8'));
    log('COLOR', 'Color Theory:', colors.magenta);
    console.log(JSON.stringify(colorTheory, null, 2));
    
    // Display font theory
    const fontTheory = JSON.parse(fs.readFileSync('public/extracted/font_theory.json', 'utf8'));
    log('FONT', 'Font Theory:', colors.magenta);
    console.log(JSON.stringify(fontTheory, null, 2));
    
    // Display the beginning of the markdown content
    const markdown = fs.readFileSync('public/extracted/resume_content.md', 'utf8');
    const markdownPreview = markdown.split('\n').slice(0, 10).join('\n');
    log('MARKDOWN', 'Markdown Preview:', colors.magenta);
    console.log(markdownPreview);
  } catch (error) {
    log('ERROR', `Failed to display extracted content: ${error.message}`, colors.red);
  }
}

/**
 * Main function
 */
function main() {
  log('START', 'Starting PDF workflow example', colors.cyan);
  
  // Get the PDF path from the command line arguments
  const pdfPath = process.argv[2];
  
  if (pdfPath) {
    // Use the provided PDF path
    if (!fs.existsSync(pdfPath)) {
      log('ERROR', `PDF file not found: ${pdfPath}`, colors.red);
      process.exit(1);
    }
    
    // Select the PDF
    if (!selectPDF(pdfPath)) {
      log('ERROR', 'Failed to select PDF', colors.red);
      process.exit(1);
    }
  } else {
    // Find all PDFs
    const pdfFiles = findPDFs();
    
    if (pdfFiles.length === 0) {
      log('ERROR', 'No PDF files found', colors.red);
      process.exit(1);
    }
    
    // Use the first PDF
    const firstPDF = pdfFiles[0];
    log('AUTO', `Using the first PDF: ${firstPDF}`, colors.yellow);
    
    // Select the PDF
    if (!selectPDF(firstPDF)) {
      log('ERROR', 'Failed to select PDF', colors.red);
      process.exit(1);
    }
  }
  
  // Test PDF extraction
  if (!testPDFExtraction()) {
    log('ERROR', 'PDF extraction test failed', colors.red);
    process.exit(1);
  }
  
  // Display the extracted content
  displayExtractedContent();
  
  // Build the application
  if (!buildApplication()) {
    log('ERROR', 'Build failed', colors.red);
    process.exit(1);
  }
  
  log('COMPLETE', 'PDF workflow example completed successfully', colors.green);
  log('NEXT', 'You can now run "npm run start" to test the application', colors.blue);
}

// Run the main function
main();
