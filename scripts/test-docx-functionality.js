/**
 * DOCX Functionality Test Script
 * 
 * This script tests the DOCX generation, preview, and download functionality.
 * It follows:
 * - Hesse philosophy by ensuring mathematical harmony in testing
 * - Müller-Brockmann philosophy with clean, structured test cases
 * - Derrida philosophy by deconstructing functionality into testable units
 * - Dante philosophy with methodical logging
 * - Kantian ethics by maintaining professional testing standards
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');
const https = require('https');

// Emoji for logging
const EMOJI = {
  START: '🧪',
  SUCCESS: '✅',
  ERROR: '❌',
  INFO: 'ℹ️',
  WARNING: '⚠️',
  DOCX: '📄',
  API: '🔌',
  STYLE: '🎨',
  DOWNLOAD: '⬇️'
};

/**
 * Test the DOCX functionality
 */
async function testDocxFunctionality() {
  console.log(`${EMOJI.START} Starting DOCX functionality tests...`);
  
  // Track test results
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0
  };
  
  // Test 1: Check if the reference.docx template exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 1: Checking reference.docx template...`);
    
    const referenceDocxPath = path.join(process.cwd(), 'templates', 'reference.docx');
    
    if (!fs.existsSync(referenceDocxPath)) {
      throw new Error('reference.docx template not found');
    }
    
    const stats = fs.statSync(referenceDocxPath);
    
    if (stats.size < 1000) {
      throw new Error(`reference.docx template is too small (${stats.size} bytes), may be invalid`);
    }
    
    console.log(`${EMOJI.SUCCESS} Test 1 passed: reference.docx template exists (${stats.size} bytes)`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 1 failed: ${error}`);
    results.failed++;
  }
  
  // Test 2: Check if the pre-generated DOCX files exist
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 2: Checking pre-generated DOCX files...`);
    
    const resumeDocxPath = path.join(process.cwd(), 'public', 'extracted', 'resume.docx');
    const introductionDocxPath = path.join(process.cwd(), 'public', 'extracted', 'introduction.docx');
    
    if (!fs.existsSync(resumeDocxPath)) {
      throw new Error('resume.docx not found');
    }
    
    if (!fs.existsSync(introductionDocxPath)) {
      throw new Error('introduction.docx not found');
    }
    
    const resumeStats = fs.statSync(resumeDocxPath);
    const introductionStats = fs.statSync(introductionDocxPath);
    
    if (resumeStats.size < 1000) {
      throw new Error(`resume.docx is too small (${resumeStats.size} bytes), may be invalid`);
    }
    
    if (introductionStats.size < 1000) {
      throw new Error(`introduction.docx is too small (${introductionStats.size} bytes), may be invalid`);
    }
    
    console.log(`${EMOJI.SUCCESS} Test 2 passed: pre-generated DOCX files exist (resume: ${resumeStats.size} bytes, introduction: ${introductionStats.size} bytes)`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 2 failed: ${error}`);
    results.failed++;
  }
  
  // Test 3: Check if pandoc is installed
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 3: Checking pandoc installation...`);
    
    const pandocVersion = execSync('pandoc --version').toString();
    
    if (!pandocVersion.includes('pandoc')) {
      throw new Error('pandoc not found or not working properly');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 3 passed: pandoc is installed (${pandocVersion.split('\n')[0]})`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 3 failed: ${error}`);
    results.failed++;
  }
  
  // Test 4: Generate a test DOCX file
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 4: Generating test DOCX file...`);
    
    const tempDir = path.join(process.cwd(), 'temp');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const testMarkdownPath = path.join(tempDir, 'test-docx.md');
    const testDocxPath = path.join(tempDir, 'test-docx.docx');
    
    // Create a test markdown file
    const testMarkdown = `# Test Document

This is a test document for DOCX generation.

## Features

- PDF-extracted font styling
- PDF-extracted color styling
- Proper heading hierarchy
- Lists and formatting

## Conclusion

This document confirms that the DOCX generation is working correctly.
`;
    
    fs.writeFileSync(testMarkdownPath, testMarkdown);
    
    // Generate a DOCX file using pandoc
    const referenceDocxPath = path.join(process.cwd(), 'templates', 'reference.docx');
    const pandocCommand = `pandoc "${testMarkdownPath}" -o "${testDocxPath}" --reference-doc="${referenceDocxPath}"`;
    
    execSync(pandocCommand);
    
    if (!fs.existsSync(testDocxPath)) {
      throw new Error('Failed to generate test DOCX file');
    }
    
    const stats = fs.statSync(testDocxPath);
    
    if (stats.size < 1000) {
      throw new Error(`Test DOCX file is too small (${stats.size} bytes), may be invalid`);
    }
    
    console.log(`${EMOJI.SUCCESS} Test 4 passed: test DOCX file generated successfully (${stats.size} bytes)`);
    results.passed++;
    
    // Clean up
    try {
      fs.unlinkSync(testMarkdownPath);
      fs.unlinkSync(testDocxPath);
    } catch (cleanupError) {
      console.log(`${EMOJI.WARNING} Warning: Failed to clean up temporary files: ${cleanupError}`);
    }
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 4 failed: ${error}`);
    results.failed++;
  }
  
  // Test 5: Check if the DocxService module exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 5: Checking DocxService module...`);
    
    const docxServicePath = path.join(process.cwd(), 'utils', 'DocxService.ts');
    
    if (!fs.existsSync(docxServicePath)) {
      throw new Error('DocxService.ts not found');
    }
    
    const docxServiceContent = fs.readFileSync(docxServicePath, 'utf8');
    
    if (!docxServiceContent.includes('downloadDocx') || !docxServiceContent.includes('generateDocx')) {
      throw new Error('DocxService.ts does not contain required methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 5 passed: DocxService module exists and contains required methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 5 failed: ${error}`);
    results.failed++;
  }
  
  // Test 6: Check if the DocxDownloadHandler component exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 6: Checking DocxDownloadHandler component...`);
    
    const docxDownloadHandlerPath = path.join(process.cwd(), 'components', 'DocxDownloadHandler.tsx');
    
    if (!fs.existsSync(docxDownloadHandlerPath)) {
      throw new Error('DocxDownloadHandler.tsx not found');
    }
    
    const docxDownloadHandlerContent = fs.readFileSync(docxDownloadHandlerPath, 'utf8');
    
    if (!docxDownloadHandlerContent.includes('usePdfStyles') || !docxDownloadHandlerContent.includes('handleDownload')) {
      throw new Error('DocxDownloadHandler.tsx does not contain required properties or methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 6 passed: DocxDownloadHandler component exists and contains required properties and methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 6 failed: ${error}`);
    results.failed++;
  }
  
  // Test 7: Check if the API endpoint exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 7: Checking API endpoint...`);
    
    const apiEndpointPath = path.join(process.cwd(), 'app', 'api', 'generate-docx', 'route.ts');
    
    if (!fs.existsSync(apiEndpointPath)) {
      throw new Error('generate-docx API endpoint not found');
    }
    
    const apiEndpointContent = fs.readFileSync(apiEndpointPath, 'utf8');
    
    if (!apiEndpointContent.includes('export async function POST') || !apiEndpointContent.includes('export async function GET')) {
      throw new Error('generate-docx API endpoint does not contain required methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 7 passed: generate-docx API endpoint exists and contains required methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 7 failed: ${error}`);
    results.failed++;
  }
  
  // Print test results
  console.log(`\n${EMOJI.INFO} Test Results:`);
  console.log(`${EMOJI.SUCCESS} Passed: ${results.passed}/${results.total}`);
  console.log(`${EMOJI.ERROR} Failed: ${results.failed}/${results.total}`);
  console.log(`${EMOJI.WARNING} Skipped: ${results.skipped}/${results.total}`);
  
  if (results.failed > 0) {
    console.log(`\n${EMOJI.ERROR} Some tests failed. Please fix the issues and run the tests again.`);
    process.exit(1);
  } else {
    console.log(`\n${EMOJI.SUCCESS} All tests passed!`);
    process.exit(0);
  }
}

// Run the tests
testDocxFunctionality().catch(error => {
  console.error(`${EMOJI.ERROR} Unhandled error: ${error}`);
  process.exit(1);
});
