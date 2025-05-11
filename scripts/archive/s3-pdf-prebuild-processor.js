#!/usr/bin/env node

/**
 * S3 PDF Pre-Build Processor
 *
 * This script processes PDFs during the build phase, extracting content,
 * analyzing it with OpenAI, and storing everything in S3 as the single source of truth.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing and reconstructing PDF content
 * - Hesse: Balancing structure with flexibility
 * - Salinger: Ensuring authentic representation by rejecting caching in favor of truth
 * - Dante: Guiding the content through a transformative journey
 */

const fs = require('fs');
const path = require('path');
const S3PdfExtractor = require('../utils/s3-pdf-extractor');
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
    hesseLogger.summary.start('Starting S3 PDF Pre-Build Processor');
    danteLogger.success.basic('Starting S3 PDF Pre-Build Processor');

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

    // 6. Save the extracted text to a local file for inspection
    const previewPath = path.join(extractedDir, 'extracted_text_preview.txt');
    fs.writeFileSync(previewPath, extractionResult.text);
    console.log(`\n${colors.yellow}Full extracted text saved to: ${previewPath}${colors.reset}`);

    // 7. Create a preview content file
    const previewContent = {
      timestamp: new Date().toISOString(),
      contentFingerprint: extractionResult.contentFingerprint,
      s3Key: extractionResult.s3Key,
      formats: {
        text: textPreview
      }
    };

    // Save the preview content
    fs.writeFileSync(
      path.join(downloadsDir, 'preview_content.json'),
      JSON.stringify(previewContent, null, 2)
    );

    hesseLogger.summary.complete('S3 PDF Pre-Build Processor completed successfully');
    danteLogger.success.perfection('S3 PDF Pre-Build Processor completed successfully');

    console.log(`\n${colors.green}${colors.bright}✅ PROCESS COMPLETED SUCCESSFULLY${colors.reset}`);
  } catch (error) {
    hesseLogger.summary.error(`Error in S3 PDF Pre-Build Processor: ${error.message}`);
    danteLogger.error.system('Error in S3 PDF Pre-Build Processor', error);

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
