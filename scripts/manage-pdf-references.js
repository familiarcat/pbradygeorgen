/**
 * PDF Reference Manager
 *
 * This script manages PDF references across the project, ensuring compatibility
 * between different naming conventions (pbradygeorgen_resume.pdf and default_resume.pdf).
 *
 * Following Derrida's philosophy of deconstruction, this script breaks down the PDF
 * management process into discrete, analyzable components.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const util = require('util');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Configuration
const PDF_NAMES = {
  PRIMARY: 'default_resume.pdf',
  LEGACY: 'pbradygeorgen_resume.pdf'
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PRIMARY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.PRIMARY);
const LEGACY_PDF_PATH = path.join(PUBLIC_DIR, PDF_NAMES.LEGACY);

/**
 * Ensures both PDF files exist, creating symbolic links if necessary
 */
function ensurePdfFiles() {
  log.info('Ensuring PDF files exist...');

  // Check if primary PDF exists
  const primaryExists = fs.existsSync(PRIMARY_PDF_PATH);
  const legacyExists = fs.existsSync(LEGACY_PDF_PATH);

  if (primaryExists && legacyExists) {
    log.success('Both PDF files exist.');
    return;
  }

  if (primaryExists && !legacyExists) {
    log.info(`Creating legacy PDF reference (${PDF_NAMES.LEGACY}) from primary (${PDF_NAMES.PRIMARY})...`);
    fs.copyFileSync(PRIMARY_PDF_PATH, LEGACY_PDF_PATH);
    log.success('Legacy PDF reference created.');
  } else if (!primaryExists && legacyExists) {
    log.info(`Creating primary PDF reference (${PDF_NAMES.PRIMARY}) from legacy (${PDF_NAMES.LEGACY})...`);
    fs.copyFileSync(LEGACY_PDF_PATH, PRIMARY_PDF_PATH);
    log.success('Primary PDF reference created.');
  } else {
    log.error('No PDF files found. Please add a PDF file to the public directory.');
    process.exit(1);
  }
}

/**
 * Processes the PDF file to extract content
 */
function processPdf() {
  log.info('Processing PDF file...');

  try {
    // Create extracted directory if it doesn't exist
    const extractedDir = path.join(PUBLIC_DIR, 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // First try to process the PDF using OpenAI
    log.info('Attempting to process PDF with OpenAI...');
    try {
      execSync(`node scripts/process-pdf-with-openai.js "${PRIMARY_PDF_PATH}"`, { stdio: 'inherit' });
      log.success('PDF processed successfully with OpenAI.');
    } catch (error) {
      log.warning(`OpenAI processing failed: ${error.message}`);
      log.info('Falling back to basic PDF extraction...');

      // Process the PDF using the extract-pdf-text-improved.js script
      execSync(`node scripts/extract-pdf-text-improved.js "${PRIMARY_PDF_PATH}"`, { stdio: 'inherit' });

      // Generate improved markdown
      const extractedTextPath = path.join(extractedDir, 'resume_content.txt');
      execSync(`node scripts/generate-improved-markdown.js "${extractedTextPath}"`, { stdio: 'inherit' });
    }

    log.success('PDF processing completed successfully.');
  } catch (error) {
    log.error(`Error processing PDF: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Updates the download test report
 */
function updateDownloadTestReport() {
  log.info('Updating download test report...');

  try {
    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(PUBLIC_DIR, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Create a basic download test report if it doesn't exist
    const downloadTestReportPath = path.join(PUBLIC_DIR, 'download_test_report.json');
    const previewContentPath = path.join(downloadsDir, 'preview_content.json');

    // Read the extracted content
    const extractedContentPath = path.join(PUBLIC_DIR, 'extracted', 'resume_content.json');
    let extractedContent = {};

    if (fs.existsSync(extractedContentPath)) {
      extractedContent = JSON.parse(fs.readFileSync(extractedContentPath, 'utf8'));
    }

    // Create preview content
    const previewContent = {
      title: extractedContent.title || 'Resume',
      summary: extractedContent.summary || 'Resume content preview',
      sections: Array.isArray(extractedContent.sections) ? extractedContent.sections : [
        {
          title: 'Summary',
          content: extractedContent.summary || 'Resume content preview'
        },
        {
          title: 'Skills',
          content: extractedContent.skills || ['JavaScript', 'TypeScript', 'React', 'Next.js', 'AWS']
        },
        {
          title: 'Experience',
          content: extractedContent.experience || 'Professional experience information'
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Create download test report
    const downloadTestReport = {
      pdfSource: PDF_NAMES.PRIMARY,
      formats: [
        {
          name: 'Plain Text',
          description: 'Simple text format',
          path: '/extracted/resume_content.txt',
          icon: '📄'
        },
        {
          name: 'Markdown',
          description: 'Formatted markdown',
          path: '/extracted/resume_content.md',
          icon: '📝'
        },
        {
          name: 'JSON',
          description: 'Structured data',
          path: '/extracted/resume_content.json',
          icon: '📊'
        },
        {
          name: 'Original PDF',
          description: 'Original PDF file',
          path: `/${PDF_NAMES.PRIMARY}`,
          icon: '📎'
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Write the files
    fs.writeFileSync(previewContentPath, JSON.stringify(previewContent, null, 2));
    fs.writeFileSync(downloadTestReportPath, JSON.stringify(downloadTestReport, null, 2));

    log.success('Download test report updated successfully.');
  } catch (error) {
    log.error(`Error updating download test report: ${error.message}`);
  }
}

/**
 * Main function
 */
function main() {
  log.info('Starting PDF reference management...');

  ensurePdfFiles();
  processPdf();
  updateDownloadTestReport();

  log.success('PDF reference management completed successfully.');
}

// Execute main function
main();
