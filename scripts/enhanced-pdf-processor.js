#!/usr/bin/env node

/**
 * Enhanced PDF Processor
 *
 * This script provides an enhanced PDF processing pipeline that ensures all content
 * is properly extracted, analyzed, and made available for the Download Functionality Test Report.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing and reconstructing PDF content with precision
 * - Hesse: Balancing structure with flexibility in a harmonious system
 * - Salinger: Simplifying the user experience through reliable content
 * - Dante: Guiding the content through a complete transformative journey
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

// Default cover letter content
const DEFAULT_COVER_LETTER = `# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`;

/**
 * Main function to process PDFs with enhanced reliability
 */
async function enhancedPdfProcessing() {
  try {
    console.log(`\n${colors.cyan}${colors.bright}🔄 ENHANCED PDF PROCESSING${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    danteLogger.success.basic('Starting enhanced PDF processing');

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
      danteLogger.error.system('PDF extraction failed', extractionResult.error);
      throw new Error(`PDF extraction failed: ${extractionResult.error}`);
    }

    // Save the raw text to the extracted directory for direct access
    fs.writeFileSync(path.join(extractedDir, 'raw_text.txt'), extractionResult.text);
    danteLogger.success.core('Saved raw text to extracted directory');

    // 4. Analyze with OpenAI
    console.log(`\n${colors.cyan}${colors.bright}🔄 ANALYZING WITH OPENAI${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    const openaiAnalyzer = new OpenAIAnalyzer({
      outputDir: extractedDir,
      cacheEnabled: true,
      debug: process.env.DEBUG_LOGGING === 'true'
    });

    const analysisResult = await openaiAnalyzer.analyzeContent(extractionResult);

    // Save the analysis result to the extracted directory for direct access
    fs.writeFileSync(
      path.join(extractedDir, 'analysis_result.json'),
      JSON.stringify(analysisResult, null, 2)
    );
    danteLogger.success.core('Saved analysis result to extracted directory');

    // Save the OpenAI query and response for display in the Download Functionality Test screen
    if (analysisResult.openaiQuery) {
      fs.writeFileSync(
        path.join(extractedDir, 'openai_query.json'),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          query: analysisResult.openaiQuery,
          response: analysisResult.openaiResponse || 'No response available',
          model: analysisResult.model || 'gpt-4o'
        }, null, 2)
      );
      danteLogger.success.core('Saved OpenAI query and response for display in Download Functionality Test');
    }

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
      danteLogger.error.system('Content generation failed', contentResult.error);
      throw new Error(`Content generation failed: ${contentResult.error}`);
    }

    // 6. Copy content to extracted directory for direct access
    console.log(`\n${colors.cyan}${colors.bright}🔄 COPYING CONTENT TO EXTRACTED DIRECTORY${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    // Copy all generated content from downloads to extracted
    const filesToCopy = [
      'resume.txt',
      'resume.md',
      'resume.json',
      'resume.html',
      'cover_letter.md',
      'cover_letter.html'
    ];

    // Always ensure cover_letter.md exists in both downloads and extracted directories
    const coverLetterDownloadPath = path.join(downloadsDir, 'cover_letter.md');
    const coverLetterExtractedPath = path.join(extractedDir, 'cover_letter.md');

    // Create cover_letter.md in downloads directory if it doesn't exist
    if (!fs.existsSync(coverLetterDownloadPath)) {
      fs.writeFileSync(coverLetterDownloadPath, DEFAULT_COVER_LETTER);
      danteLogger.success.basic('Created default cover letter in downloads directory');
    }

    // Create cover_letter.md in extracted directory (copy from downloads or create new)
    if (fs.existsSync(coverLetterDownloadPath)) {
      fs.copyFileSync(coverLetterDownloadPath, coverLetterExtractedPath);
      danteLogger.success.basic('Copied cover letter from downloads to extracted directory');
    } else {
      fs.writeFileSync(coverLetterExtractedPath, DEFAULT_COVER_LETTER);
      danteLogger.success.basic('Created default cover letter in extracted directory');
    }

    // Copy the rest of the files
    filesToCopy.forEach(file => {
      // Skip cover_letter.md as we've already handled it
      if (file === 'cover_letter.md') return;

      const sourcePath = path.join(downloadsDir, file);
      const destPath = path.join(extractedDir, file);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        danteLogger.success.basic(`Copied ${file} to extracted directory`);
      } else {
        danteLogger.warn.deprecated(`${file} not found in downloads directory`);
      }
    });

    // 7. Generate test report
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
      danteLogger.error.system('Test report generation failed', reportResult.error);
      throw new Error(`Test report generation failed: ${reportResult.error}`);
    }

    // 8. Create a content manifest for the Download Functionality Test
    console.log(`\n${colors.cyan}${colors.bright}🔄 CREATING CONTENT MANIFEST${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    const contentManifest = {
      timestamp: new Date().toISOString(),
      source: {
        pdf: {
          path: '/default_resume.pdf',
          size: fs.statSync(defaultResumePath).size
        }
      },
      extracted: {
        raw_text: {
          path: '/extracted/raw_text.txt',
          size: fs.statSync(path.join(extractedDir, 'raw_text.txt')).size
        },
        analysis: {
          path: '/extracted/analysis_result.json',
          size: fs.statSync(path.join(extractedDir, 'analysis_result.json')).size
        },
        openai_query: fs.existsSync(path.join(extractedDir, 'openai_query.json')) ? {
          path: '/extracted/openai_query.json',
          size: fs.statSync(path.join(extractedDir, 'openai_query.json')).size
        } : null,
        cover_letter: fs.existsSync(path.join(extractedDir, 'cover_letter.md')) ? {
          path: '/extracted/cover_letter.md',
          size: fs.statSync(path.join(extractedDir, 'cover_letter.md')).size
        } : null
      },
      downloads: {},
      preview: {
        available: fs.existsSync(path.join(downloadsDir, 'preview_content.json')),
        path: '/downloads/preview_content.json'
      },
      test_report: {
        available: fs.existsSync(path.join(publicDir, 'download_test_report.json')),
        path: '/download_test_report.json'
      }
    };

    // Add all download formats to the manifest
    filesToCopy.forEach(file => {
      const filePath = path.join(downloadsDir, file);
      if (fs.existsSync(filePath)) {
        contentManifest.downloads[file] = {
          path: `/downloads/${file}`,
          size: fs.statSync(filePath).size
        };
      }
    });

    // Save the content manifest
    fs.writeFileSync(
      path.join(publicDir, 'content_manifest.json'),
      JSON.stringify(contentManifest, null, 2)
    );
    danteLogger.success.core('Created content manifest');

    // 9. Final output
    console.log(`\n${colors.green}${colors.bright}✅ ENHANCED PDF PROCESSING COMPLETED${colors.reset}`);
    console.log(`${colors.green}=============================`);
    console.log(`Generated download formats: ${contentResult.formatCount}`);
    console.log(`Total size: ${contentResult.totalSize} bytes`);
    console.log(`All formats available: ${contentResult.allFormatsAvailable ? 'Yes' : 'No'}`);
    console.log(`Download test report saved to: ${reportResult.reportPath}`);
    console.log(`Preview content saved to: ${reportResult.previewPath}`);
    console.log(`Content manifest saved to: ${path.join(publicDir, 'content_manifest.json')}`);

    danteLogger.success.perfection('Enhanced PDF processing completed successfully');

    return {
      success: true,
      extractionResult,
      analysisResult,
      contentResult,
      reportResult,
      contentManifest
    };
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ ENHANCED PDF PROCESSING FAILED${colors.reset}`);
    console.error(`${colors.red}=============================`);
    console.error(`Error: ${error.message}`);

    if (process.env.DEBUG_LOGGING === 'true') {
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// Run the main function
enhancedPdfProcessing();
