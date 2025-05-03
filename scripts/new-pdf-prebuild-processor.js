#!/usr/bin/env node

/**
 * New PDF Pre-Build Processor
 * 
 * This script processes PDFs during the build phase, extracting content,
 * analyzing it with OpenAI, generating download formats, and creating
 * a test report.
 * 
 * Philosophical Framework:
 * - Derrida: Deconstructing and reconstructing PDF content
 * - Hesse: Balancing structure with flexibility
 * - Salinger: Simplifying the user experience
 * - Dante: Guiding the content through a transformative journey
 */

const fs = require('fs');
const path = require('path');
const PdfExtractor = require('../utils/pdf-extractor');
const OpenAIAnalyzer = require('../utils/openai-analyzer');
const ContentGenerator = require('../utils/content-generator');
const TestReportGenerator = require('../utils/test-report-generator');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Dante emoji logger
const danteEmoji = {
  success: {
    basic: '😇☀️: ',
    core: '😇🌟: ',
    perfection: '😇🌈: '
  },
  error: {
    system: '👑💢: ',
    dataFlow: '⚠️⚡: ',
    validation: '⚠️🔥: '
  },
  warn: {
    deprecated: '⚠️🌊: ',
    performance: '⚠️⏱️: ',
    security: '⚠️🔒: '
  }
};

// Hesse logger
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic}${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core}${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection}${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system}${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow}${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation}${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated}${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance}${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security}${message}${colors.reset}`)
  }
};

/**
 * Main function to process PDFs during build
 */
async function processPdfsForBuild() {
  try {
    console.log(`\n${colors.cyan}${colors.bright}🔄 PDF PRE-BUILD PROCESSING${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    hesseLogger.summary.start('Starting PDF pre-build processing');
    danteLogger.success.basic('Starting PDF pre-build processing');
    
    // 1. Set up directories
    const publicDir = path.join(process.cwd(), 'public');
    const extractedDir = path.join(publicDir, 'extracted');
    const downloadsDir = path.join(publicDir, 'downloads');
    
    // Ensure directories exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
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
    
    // 3. Extract text from PDF
    console.log(`\n${colors.cyan}${colors.bright}🔄 EXTRACTING TEXT FROM PDF${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const pdfExtractor = new PdfExtractor({
      outputDir: extractedDir,
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const extractionResult = await pdfExtractor.extractText(defaultResumePath, false);
    
    if (!extractionResult.success) {
      hesseLogger.summary.error(`PDF extraction failed: ${extractionResult.error}`);
      danteLogger.error.system('PDF extraction failed', extractionResult.error);
      throw new Error(`PDF extraction failed: ${extractionResult.error}`);
    }
    
    // 4. Analyze with OpenAI
    console.log(`\n${colors.cyan}${colors.bright}🔄 ANALYZING WITH OPENAI${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const openaiAnalyzer = new OpenAIAnalyzer({
      outputDir: extractedDir,
      cacheEnabled: true,
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const analysisResult = await openaiAnalyzer.analyzeContent(extractionResult);
    
    // 5. Generate content formats
    console.log(`\n${colors.cyan}${colors.bright}🔄 GENERATING CONTENT FORMATS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const contentGenerator = new ContentGenerator({
      inputDir: extractedDir,
      outputDir: downloadsDir,
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const contentResult = await contentGenerator.generateContent(analysisResult);
    
    if (!contentResult.success) {
      hesseLogger.summary.error(`Content generation failed: ${contentResult.error}`);
      danteLogger.error.system('Content generation failed', contentResult.error);
      throw new Error(`Content generation failed: ${contentResult.error}`);
    }
    
    // 6. Generate test report
    console.log(`\n${colors.cyan}${colors.bright}🔄 GENERATING TEST REPORT${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const testReportGenerator = new TestReportGenerator({
      extractedDir,
      downloadsDir,
      publicDir,
      debug: process.env.DEBUG_LOGGING === 'true'
    });
    
    const reportResult = await testReportGenerator.generateReport(
      extractionResult,
      analysisResult,
      contentResult
    );
    
    if (!reportResult.success) {
      hesseLogger.summary.error(`Test report generation failed: ${reportResult.error}`);
      danteLogger.error.system('Test report generation failed', reportResult.error);
      throw new Error(`Test report generation failed: ${reportResult.error}`);
    }
    
    // 7. Final output
    console.log(`\n${colors.green}${colors.bright}✅ PDF PRE-BUILD PROCESSING COMPLETED${colors.reset}`);
    console.log(`${colors.green}=============================`);
    console.log(`Generated download formats: ${contentResult.formatCount}`);
    console.log(`Total size: ${contentResult.totalSize} bytes`);
    console.log(`All formats available: ${contentResult.allFormatsAvailable ? 'Yes' : 'No'}`);
    console.log(`Download test report saved to: ${reportResult.reportPath}`);
    console.log(`Preview content saved to: ${reportResult.previewPath}`);
    
    hesseLogger.summary.complete('PDF pre-build processing completed successfully');
    danteLogger.success.perfection('PDF pre-build processing completed successfully');
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ PDF PRE-BUILD PROCESSING FAILED${colors.reset}`);
    console.error(`${colors.red}=============================`);
    console.error(`Error: ${error.message}`);
    
    if (process.env.DEBUG_LOGGING === 'true') {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Run the main function
processPdfsForBuild();
