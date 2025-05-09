#!/usr/bin/env node

/**
 * Test S3 Cover Letter Generator
 * 
 * This script tests the S3 Cover Letter Generator functionality to ensure it works correctly
 * by generating a personalized cover letter based on the analyzed resume content.
 * 
 * Philosophical Framework:
 * - Hesse: Testing the harmonious patterns of cover letter generation
 * - Salinger: Ensuring authentic representation by rejecting templates
 * - Derrida: Deconstructing the resume and reconstructing it as a cover letter
 * - Dante: Continuing the journey of content transformation
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const S3PdfExtractor = require('../utils/s3-pdf-extractor');
const S3OpenAIAnalyzer = require('../utils/s3-openai-analyzer');
const S3CoverLetterGenerator = require('../utils/s3-cover-letter-generator');
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
  console.log(`\n${colors.cyan}${colors.bright}🧪 TESTING S3 COVER LETTER GENERATOR${colors.reset}`);
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
  
  // Step 1: Extract text from PDF
  console.log(`\n${colors.magenta}${colors.bright}📄 STEP 1: EXTRACTING TEXT FROM PDF${colors.reset}`);
  
  const pdfExtractor = new S3PdfExtractor({
    debug: true
  });
  
  const extractionResult = await pdfExtractor.extractText(defaultResumePath, false);
  
  if (!extractionResult.success) {
    console.error(`${colors.red}${colors.bright}❌ PDF extraction failed: ${extractionResult.error}${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ PDF extraction successful${colors.reset}`);
  console.log(`Content Fingerprint: ${extractionResult.contentFingerprint}`);
  
  // Step 2: Analyze extracted text with OpenAI
  console.log(`\n${colors.magenta}${colors.bright}🧠 STEP 2: ANALYZING EXTRACTED TEXT WITH OPENAI${colors.reset}`);
  
  const openaiAnalyzer = new S3OpenAIAnalyzer({
    debug: true
  });
  
  const analysisResult = await openaiAnalyzer.analyzeExtractedText(extractionResult.contentFingerprint, false);
  
  if (!analysisResult.success) {
    console.error(`${colors.red}${colors.bright}❌ OpenAI analysis failed: ${analysisResult.error}${colors.reset}`);
    console.error(analysisResult.details);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ OpenAI analysis successful${colors.reset}`);
  
  // Step 3: Generate cover letter
  console.log(`\n${colors.magenta}${colors.bright}📝 STEP 3: GENERATING COVER LETTER${colors.reset}`);
  
  const coverLetterGenerator = new S3CoverLetterGenerator({
    debug: true,
    forceOverwrite: true // Force overwrite for testing
  });
  
  // Sample cover letter parameters
  const coverLetterParams = {
    company: 'Innovative Health Solutions',
    position: 'Senior Clinical Informatics Specialist',
    hiringManager: 'Dr. Sarah Johnson',
    companyDetails: 'A leading healthcare technology company focused on improving patient outcomes through innovative digital solutions.',
    positionDetails: 'Looking for an experienced professional to lead the implementation and optimization of clinical information systems, train staff, and ensure data security compliance.'
  };
  
  const coverLetterResult = await coverLetterGenerator.generateCoverLetter(
    extractionResult.contentFingerprint,
    coverLetterParams,
    true
  );
  
  if (!coverLetterResult.success) {
    console.error(`${colors.red}${colors.bright}❌ Cover letter generation failed: ${coverLetterResult.error}${colors.reset}`);
    console.error(coverLetterResult.details);
    process.exit(1);
  }
  
  console.log(`\n${colors.green}${colors.bright}✅ COVER LETTER GENERATION SUCCESSFUL${colors.reset}`);
  console.log(`${colors.green}=============================`);
  
  // Display cover letter details
  console.log(`Content Fingerprint: ${coverLetterResult.contentFingerprint}`);
  console.log(`Markdown S3 Key: ${coverLetterResult.s3Key}`);
  console.log(`HTML S3 Key: ${coverLetterResult.htmlS3Key}`);
  console.log(`Prompt/Response S3 Key: ${coverLetterResult.promptResponseS3Key}`);
  console.log(`Cached: ${coverLetterResult.cached}`);
  
  // Display cover letter preview
  console.log(`\n${colors.cyan}${colors.bright}📋 COVER LETTER PREVIEW${colors.reset}`);
  console.log(`${colors.cyan}=============================`);
  
  const coverLetterPreview = coverLetterResult.coverLetter.split('\n').slice(0, 15).join('\n');
  console.log(coverLetterPreview + '\n...');
  
  // Save the cover letter to files for inspection
  const markdownPath = path.join(process.cwd(), 'cover_letter_preview.md');
  fs.writeFileSync(markdownPath, coverLetterResult.coverLetter);
  console.log(`\n${colors.yellow}Full cover letter markdown saved to: ${markdownPath}${colors.reset}`);
  
  const htmlPath = path.join(process.cwd(), 'cover_letter_preview.html');
  fs.writeFileSync(htmlPath, coverLetterResult.coverLetterHtml);
  console.log(`${colors.yellow}Full cover letter HTML saved to: ${htmlPath}${colors.reset}`);
  
  // Save the OpenAI prompt and response
  const promptResponsePath = path.join(process.cwd(), 'cover_letter_prompt_response.json');
  
  // Download the prompt and response from S3
  const { S3StorageManager } = require('../utils/s3StorageManager.js');
  const s3Manager = S3StorageManager.getInstance();
  const promptResponseResult = await s3Manager.downloadText(coverLetterResult.promptResponseS3Key);
  
  if (promptResponseResult.success && promptResponseResult.content) {
    fs.writeFileSync(promptResponsePath, promptResponseResult.content);
    console.log(`${colors.yellow}OpenAI prompt and response saved to: ${promptResponsePath}${colors.reset}`);
  }
  
  console.log(`\n${colors.green}${colors.bright}✅ TEST COMPLETED SUCCESSFULLY${colors.reset}`);
}

// Run the test
runTest().catch(error => {
  console.error(`${colors.red}${colors.bright}❌ ERROR: ${error.message}${colors.reset}`);
  console.error(error);
  process.exit(1);
});
