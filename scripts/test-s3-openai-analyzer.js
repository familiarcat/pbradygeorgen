#!/usr/bin/env node

/**
 * Test S3 OpenAI Analyzer
 * 
 * This script tests the S3 OpenAI Analyzer functionality to ensure it works correctly
 * by analyzing extracted PDF content and storing the results in S3.
 * 
 * Philosophical Framework:
 * - Hesse: Testing the harmonious patterns of content analysis
 * - Salinger: Ensuring authentic representation by rejecting templates
 * - Derrida: Deconstructing and reconstructing content with meaning
 * - Dante: Continuing the journey of content transformation
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const S3PdfExtractor = require('../utils/s3-pdf-extractor');
const S3OpenAIAnalyzer = require('../utils/s3-openai-analyzer');
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
  console.log(`\n${colors.cyan}${colors.bright}🧪 TESTING S3 OPENAI ANALYZER${colors.reset}`);
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
    debug: true,
    forceOverwrite: true // Force overwrite for testing
  });
  
  const analysisResult = await openaiAnalyzer.analyzeExtractedText(extractionResult.contentFingerprint, true);
  
  if (!analysisResult.success) {
    console.error(`${colors.red}${colors.bright}❌ OpenAI analysis failed: ${analysisResult.error}${colors.reset}`);
    console.error(analysisResult.details);
    process.exit(1);
  }
  
  console.log(`\n${colors.green}${colors.bright}✅ OPENAI ANALYSIS SUCCESSFUL${colors.reset}`);
  console.log(`${colors.green}=============================`);
  
  // Display analysis details
  console.log(`Content Fingerprint: ${analysisResult.contentFingerprint}`);
  console.log(`Analysis S3 Key: ${analysisResult.s3Key}`);
  console.log(`Prompt/Response S3 Key: ${analysisResult.promptResponseS3Key}`);
  console.log(`Cached: ${analysisResult.cached}`);
  
  // Display analysis preview
  console.log(`\n${colors.cyan}${colors.bright}📋 ANALYSIS PREVIEW${colors.reset}`);
  console.log(`${colors.cyan}=============================`);
  
  // Display name and summary
  console.log(`Name: ${colors.bright}${analysisResult.analysis.name}${colors.reset}`);
  console.log(`\nSummary: ${analysisResult.analysis.summary}`);
  
  // Display skills
  console.log(`\nSkills: ${colors.yellow}${analysisResult.analysis.skills.join(', ')}${colors.reset}`);
  
  // Display experience preview
  if (analysisResult.analysis.experience && analysisResult.analysis.experience.length > 0) {
    console.log(`\nExperience (${analysisResult.analysis.experience.length} entries):`);
    analysisResult.analysis.experience.forEach((exp, index) => {
      if (index < 2) { // Show only first 2 experiences
        console.log(`  - ${colors.bright}${exp.title}${colors.reset} at ${exp.company} (${exp.dates})`);
      }
    });
    if (analysisResult.analysis.experience.length > 2) {
      console.log(`  ... and ${analysisResult.analysis.experience.length - 2} more`);
    }
  }
  
  // Display formatted markdown preview
  console.log(`\n${colors.cyan}${colors.bright}📝 FORMATTED MARKDOWN PREVIEW${colors.reset}`);
  console.log(`${colors.cyan}=============================`);
  
  const markdownPreview = analysisResult.formattedMarkdown.split('\n').slice(0, 15).join('\n');
  console.log(markdownPreview + '\n...');
  
  // Save the analysis and formatted markdown to files for inspection
  const analysisPath = path.join(process.cwd(), 'analysis_preview.json');
  fs.writeFileSync(analysisPath, JSON.stringify(analysisResult.analysis, null, 2));
  console.log(`\n${colors.yellow}Full analysis saved to: ${analysisPath}${colors.reset}`);
  
  const markdownPath = path.join(process.cwd(), 'formatted_markdown_preview.md');
  fs.writeFileSync(markdownPath, analysisResult.formattedMarkdown);
  console.log(`${colors.yellow}Full formatted markdown saved to: ${markdownPath}${colors.reset}`);
  
  // Save the OpenAI prompt and response
  const promptResponsePath = path.join(process.cwd(), 'openai_prompt_response.json');
  
  // Download the prompt and response from S3
  const { S3StorageManager } = require('../utils/s3StorageManager.js');
  const s3Manager = S3StorageManager.getInstance();
  const promptResponseResult = await s3Manager.downloadText(analysisResult.promptResponseS3Key);
  
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
