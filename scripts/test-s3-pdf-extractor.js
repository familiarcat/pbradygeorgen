#!/usr/bin/env node

/**
 * Test S3 PDF Extractor
 * 
 * This script tests the S3 PDF Extractor functionality to ensure it works correctly
 * both locally and with AWS S3.
 * 
 * Philosophical Framework:
 * - Hesse: Testing the harmonious patterns of PDF extraction
 * - Salinger: Ensuring authentic representation by verifying content integrity
 * - Derrida: Deconstructing the PDF extraction process to verify each component
 * - Dante: Guiding content through its journey from PDF to text
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const S3PdfExtractor = require('../utils/s3-pdf-extractor');
require('dotenv').config();

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

/**
 * Main test function
 */
async function runTest() {
  console.log(`\n${colors.cyan}${colors.bright}🧪 TESTING S3 PDF EXTRACTOR${colors.reset}`);
  console.log(`${colors.cyan}=============================`);
  
  // Get the default resume path
  const publicDir = path.join(process.cwd(), 'public');
  const defaultResumePath = path.join(publicDir, 'default_resume.pdf');
  
  // Check if the default resume exists
  if (!fs.existsSync(defaultResumePath)) {
    console.error(`${colors.red}${colors.bright}❌ Default resume not found at ${defaultResumePath}${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.yellow}Using PDF: ${defaultResumePath}${colors.reset}`);
  
  // Create an instance of the S3 PDF Extractor
  const pdfExtractor = new S3PdfExtractor({
    debug: true,
    forceOverwrite: true // Force overwrite for testing
  });
  
  // Run the extraction
  try {
    console.log(`\n${colors.magenta}${colors.bright}📄 Extracting text from PDF${colors.reset}`);
    
    const extractionResult = await pdfExtractor.extractText(defaultResumePath, true);
    
    if (!extractionResult.success) {
      throw new Error(`PDF extraction failed: ${extractionResult.error}`);
    }
    
    console.log(`\n${colors.green}${colors.bright}✅ PDF EXTRACTION SUCCESSFUL${colors.reset}`);
    console.log(`${colors.green}=============================`);
    
    // Display extraction details
    console.log(`Content Fingerprint: ${extractionResult.contentFingerprint}`);
    console.log(`S3 Key: ${extractionResult.s3Key}`);
    console.log(`Cached: ${extractionResult.cached}`);
    
    // Display metadata
    console.log(`\n${colors.cyan}${colors.bright}📋 METADATA${colors.reset}`);
    console.log(JSON.stringify(extractionResult.metadata, null, 2));
    
    // Display extracted text preview
    console.log(`\n${colors.cyan}${colors.bright}📝 EXTRACTED TEXT PREVIEW${colors.reset}`);
    const textPreview = extractionResult.text.substring(0, 500) + (extractionResult.text.length > 500 ? '...' : '');
    console.log(textPreview);
    
    // Save the extracted text to a file for inspection
    const previewPath = path.join(process.cwd(), 'extracted_text_preview.txt');
    fs.writeFileSync(previewPath, extractionResult.text);
    console.log(`\n${colors.yellow}Full extracted text saved to: ${previewPath}${colors.reset}`);
    
    console.log(`\n${colors.green}${colors.bright}✅ TEST COMPLETED SUCCESSFULLY${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ TEST FAILED: ${error.message}${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the test
runTest().catch(error => {
  console.error(`${colors.red}${colors.bright}❌ ERROR: ${error.message}${colors.reset}`);
  console.error(error);
  process.exit(1);
});
