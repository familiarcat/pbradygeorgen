#!/usr/bin/env node

/**
 * S3 OpenAI Pre-Build Processor
 * 
 * This script processes PDFs during the build phase, extracting content,
 * analyzing it with OpenAI, and storing everything in S3 as the single source of truth.
 * 
 * Philosophical Framework:
 * - Derrida: Deconstructing and reconstructing PDF content with meaning
 * - Hesse: Finding patterns and connections in the content
 * - Salinger: Ensuring authentic representation by rejecting templates
 * - Dante: Guiding the content through a transformative journey
 */

const fs = require('fs');
const path = require('path');
const S3PdfExtractor = require('../utils/s3-pdf-extractor');
const S3OpenAIAnalyzer = require('../utils/s3-openai-analyzer');
const { S3StorageManager } = require('../utils/s3StorageManager.js');
require('dotenv').config();

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Use the Dante and Hesse loggers
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}😇☀️: ${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}😇🌟: ${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}😇🌈: ${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}👑💢: ${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}⚠️⚡: ${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}⚠️🔥: ${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}⚠️🌊: ${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}⚠️⏱️: ${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}⚠️🔒: ${message}${colors.reset}`)
  }
};

const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

/**
 * Main function
 */
async function main() {
  try {
    hesseLogger.summary.start('Starting S3 OpenAI Pre-Build Processor');
    danteLogger.success.basic('Starting S3 OpenAI Pre-Build Processor');
    
    // 1. Set up directories
    const publicDir = path.join(process.cwd(), 'public');
    const extractedDir = path.join(publicDir, 'extracted');
    const downloadsDir = path.join(publicDir, 'downloads');
    
    // Ensure directories exist
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }
    
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // 2. Get the default resume path
    const defaultResumePath = path.join(publicDir, 'default_resume.pdf');
    
    // Check if the default resume exists
    if (!fs.existsSync(defaultResumePath)) {
      hesseLogger.summary.error('Default resume not found');
      danteLogger.error.system('Default resume not found');
      throw new Error(`Default resume not found at ${defaultResumePath}`);
    }
    
    // 3. Extract text from PDF and store in S3
    console.log(`\n${colors.cyan}${colors.bright}🔄 EXTRACTING TEXT FROM PDF AND STORING IN S3${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const pdfExtractor = new S3PdfExtractor({
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const extractionResult = await pdfExtractor.extractText(defaultResumePath, false);
    
    if (!extractionResult.success) {
      hesseLogger.summary.error(`PDF extraction failed: ${extractionResult.error}`);
      danteLogger.error.system('PDF extraction failed', extractionResult.error);
      throw new Error(`PDF extraction failed: ${extractionResult.error}`);
    }
    
    // 4. Display extraction results
    console.log(`\n${colors.cyan}${colors.bright}📋 EXTRACTION RESULTS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    console.log(`Content Fingerprint: ${extractionResult.contentFingerprint}`);
    console.log(`S3 Key: ${extractionResult.s3Key}`);
    console.log(`Cached: ${extractionResult.cached}`);
    
    // 5. Display extracted text preview
    console.log(`\n${colors.cyan}${colors.bright}📝 EXTRACTED TEXT PREVIEW${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const textPreview = extractionResult.text.substring(0, 500) + (extractionResult.text.length > 500 ? '...' : '');
    console.log(textPreview);
    
    // 6. Analyze extracted text with OpenAI
    console.log(`\n${colors.cyan}${colors.bright}🧠 ANALYZING EXTRACTED TEXT WITH OPENAI${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const openaiAnalyzer = new S3OpenAIAnalyzer({
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const analysisResult = await openaiAnalyzer.analyzeExtractedText(extractionResult.contentFingerprint, false);
    
    if (!analysisResult.success) {
      hesseLogger.summary.error(`OpenAI analysis failed: ${analysisResult.error}`);
      danteLogger.error.system('OpenAI analysis failed', analysisResult.error);
      throw new Error(`OpenAI analysis failed: ${analysisResult.error}`);
    }
    
    // 7. Display analysis results
    console.log(`\n${colors.cyan}${colors.bright}📊 ANALYSIS RESULTS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    console.log(`Analysis S3 Key: ${analysisResult.s3Key}`);
    console.log(`Prompt/Response S3 Key: ${analysisResult.promptResponseS3Key}`);
    console.log(`Cached: ${analysisResult.cached}`);
    
    // 8. Display analysis preview
    console.log(`\n${colors.cyan}${colors.bright}📋 ANALYSIS PREVIEW${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    // Display name and summary
    console.log(`Name: ${colors.bright}${analysisResult.analysis.name}${colors.reset}`);
    console.log(`\nSummary: ${analysisResult.analysis.summary}`);
    
    // Display skills
    console.log(`\nSkills: ${colors.yellow}${analysisResult.analysis.skills.join(', ')}${colors.reset}`);
    
    // 9. Save the analysis and formatted markdown to local files for reference
    const analysisPath = path.join(extractedDir, 'resume_analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysisResult.analysis, null, 2));
    
    const markdownPath = path.join(extractedDir, 'resume_formatted.md');
    fs.writeFileSync(markdownPath, analysisResult.formattedMarkdown);
    
    const promptResponsePath = path.join(extractedDir, 'openai_prompt_response.json');
    
    // Download the prompt and response from S3
    const s3Manager = S3StorageManager.getInstance();
    const promptResponseResult = await s3Manager.downloadText(analysisResult.promptResponseS3Key);
    
    if (promptResponseResult.success && promptResponseResult.content) {
      fs.writeFileSync(promptResponsePath, promptResponseResult.content);
    }
    
    // 10. Create a test report content file
    const testReportContent = {
      timestamp: new Date().toISOString(),
      contentFingerprint: extractionResult.contentFingerprint,
      extraction: {
        s3Key: extractionResult.s3Key,
        cached: extractionResult.cached,
        textPreview: textPreview
      },
      analysis: {
        s3Key: analysisResult.s3Key,
        promptResponseS3Key: analysisResult.promptResponseS3Key,
        cached: analysisResult.cached,
        name: analysisResult.analysis.name,
        summary: analysisResult.analysis.summary,
        skills: analysisResult.analysis.skills
      }
    };
    
    // Save the test report content
    fs.writeFileSync(
      path.join(downloadsDir, 'test_report_content.json'),
      JSON.stringify(testReportContent, null, 2)
    );
    
    hesseLogger.summary.complete('S3 OpenAI Pre-Build Processor completed successfully');
    danteLogger.success.perfection('S3 OpenAI Pre-Build Processor completed successfully');
    
    console.log(`\n${colors.green}${colors.bright}✅ PROCESS COMPLETED SUCCESSFULLY${colors.reset}`);
    console.log(`\n${colors.yellow}Files saved for reference:${colors.reset}`);
    console.log(`- Analysis: ${analysisPath}`);
    console.log(`- Formatted Markdown: ${markdownPath}`);
    console.log(`- OpenAI Prompt/Response: ${promptResponsePath}`);
    console.log(`- Test Report: ${path.join(downloadsDir, 'test_report_content.json')}`);
  } catch (error) {
    hesseLogger.summary.error(`Error in S3 OpenAI Pre-Build Processor: ${error.message}`);
    danteLogger.error.system('Error in S3 OpenAI Pre-Build Processor', error);
    
    console.error(`\n${colors.red}${colors.bright}❌ PROCESS FAILED: ${error.message}${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}${colors.bright}❌ ERROR: ${error.message}${colors.reset}`);
  console.error(error);
  process.exit(1);
});
