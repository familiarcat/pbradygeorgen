/**
 * DOCX CI Test Script
 * 
 * This script tests the DOCX functionality in a CI environment.
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
 * Test the DOCX functionality in a CI environment
 */
async function testDocxCI() {
  console.log(`${EMOJI.START} Starting DOCX CI tests...`);
  
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
  
  // Test 2: Check if the generate-reference-docx.js script exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 2: Checking generate-reference-docx.js script...`);
    
    const generateReferenceDocxPath = path.join(process.cwd(), 'scripts', 'generate-reference-docx.js');
    
    if (!fs.existsSync(generateReferenceDocxPath)) {
      throw new Error('generate-reference-docx.js script not found');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 2 passed: generate-reference-docx.js script exists`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 2 failed: ${error}`);
    results.failed++;
  }
  
  // Test 3: Check if the DocxService module exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 3: Checking DocxService module...`);
    
    const docxServicePath = path.join(process.cwd(), 'utils', 'DocxService.ts');
    
    if (!fs.existsSync(docxServicePath)) {
      throw new Error('DocxService.ts not found');
    }
    
    const docxServiceContent = fs.readFileSync(docxServicePath, 'utf8');
    
    if (!docxServiceContent.includes('downloadDocx') || !docxServiceContent.includes('generateDocx')) {
      throw new Error('DocxService.ts does not contain required methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 3 passed: DocxService module exists and contains required methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 3 failed: ${error}`);
    results.failed++;
  }
  
  // Test 4: Check if the DocxDownloadHandler component exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 4: Checking DocxDownloadHandler component...`);
    
    const docxDownloadHandlerPath = path.join(process.cwd(), 'components', 'DocxDownloadHandler.tsx');
    
    if (!fs.existsSync(docxDownloadHandlerPath)) {
      throw new Error('DocxDownloadHandler.tsx not found');
    }
    
    const docxDownloadHandlerContent = fs.readFileSync(docxDownloadHandlerPath, 'utf8');
    
    if (!docxDownloadHandlerContent.includes('usePdfStyles') || !docxDownloadHandlerContent.includes('handleDownload')) {
      throw new Error('DocxDownloadHandler.tsx does not contain required properties or methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 4 passed: DocxDownloadHandler component exists and contains required properties and methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 4 failed: ${error}`);
    results.failed++;
  }
  
  // Test 5: Check if the API endpoint exists
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 5: Checking API endpoint...`);
    
    const apiEndpointPath = path.join(process.cwd(), 'app', 'api', 'generate-docx', 'route.ts');
    
    if (!fs.existsSync(apiEndpointPath)) {
      throw new Error('generate-docx API endpoint not found');
    }
    
    const apiEndpointContent = fs.readFileSync(apiEndpointPath, 'utf8');
    
    if (!apiEndpointContent.includes('export async function POST') || !apiEndpointContent.includes('export async function GET')) {
      throw new Error('generate-docx API endpoint does not contain required methods');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 5 passed: generate-docx API endpoint exists and contains required methods`);
    results.passed++;
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 5 failed: ${error}`);
    results.failed++;
  }
  
  // Test 6: Check if pandoc is installed
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 6: Checking pandoc installation...`);
    
    try {
      const pandocVersion = execSync('pandoc --version').toString();
      
      if (!pandocVersion.includes('pandoc')) {
        throw new Error('pandoc not found or not working properly');
      }
      
      console.log(`${EMOJI.SUCCESS} Test 6 passed: pandoc is installed (${pandocVersion.split('\n')[0]})`);
      results.passed++;
    } catch (pandocError) {
      console.log(`${EMOJI.WARNING} Test 6 skipped: pandoc not installed in CI environment (this is expected)`);
      results.skipped++;
    }
  } catch (error) {
    console.log(`${EMOJI.ERROR} Test 6 failed: ${error}`);
    results.failed++;
  }
  
  // Test 7: Check if the prebuild script includes DOCX generation
  try {
    results.total++;
    console.log(`${EMOJI.INFO} Test 7: Checking prebuild script...`);
    
    const prebuildPath = path.join(process.cwd(), 'amplify-prebuild.sh');
    
    if (!fs.existsSync(prebuildPath)) {
      throw new Error('amplify-prebuild.sh not found');
    }
    
    const prebuildContent = fs.readFileSync(prebuildPath, 'utf8');
    
    if (!prebuildContent.includes('generate-reference-docx.js') || !prebuildContent.includes('DOCX')) {
      throw new Error('amplify-prebuild.sh does not include DOCX generation');
    }
    
    console.log(`${EMOJI.SUCCESS} Test 7 passed: prebuild script includes DOCX generation`);
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
testDocxCI().catch(error => {
  console.error(`${EMOJI.ERROR} Unhandled error: ${error}`);
  process.exit(1);
});
