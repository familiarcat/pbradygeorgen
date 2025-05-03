/**
 * Test Report Generator Module
 * 
 * This module generates the Download Functionality Test Report.
 * It's the final step in the PDF processing pipeline.
 * 
 * Philosophical Framework:
 * - Derrida: Analyzing the differences between formats
 * - Hesse: Balancing technical details with user experience
 * - Salinger: Creating a clean, user-focused report
 * - Dante: Completing the journey with reflection
 */

const fs = require('fs');
const path = require('path');

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
 * Test Report Generator class
 */
class TestReportGenerator {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      extractedDir: options.extractedDir || path.join(process.cwd(), 'public', 'extracted'),
      downloadsDir: options.downloadsDir || path.join(process.cwd(), 'public', 'downloads'),
      publicDir: options.publicDir || path.join(process.cwd(), 'public'),
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      ...options
    };
  }
  
  /**
   * Generate test report
   * @param {Object} extractionResult - Result from the PDF extraction
   * @param {Object} analysisResult - Result from the OpenAI analysis
   * @param {Object} contentResult - Result from the content generation
   * @returns {Promise<Object>} - Report generation result
   */
  async generateReport(extractionResult, analysisResult, contentResult) {
    try {
      hesseLogger.summary.start('Generating Download Functionality Test Report');
      danteLogger.success.basic('Starting test report generation');
      
      // Get the default resume path
      const defaultResumePath = path.join(this.options.publicDir, 'default_resume.pdf');
      
      // Generate the test report
      const testReport = {
        timestamp: new Date().toISOString(),
        formats: {
          pdf: {
            available: fs.existsSync(defaultResumePath),
            path: '/default_resume.pdf',
            size: fs.existsSync(defaultResumePath) ? fs.statSync(defaultResumePath).size : 0
          },
          text: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'resume.txt')),
            path: '/downloads/resume.txt',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'resume.txt')) ? fs.statSync(path.join(this.options.downloadsDir, 'resume.txt')).size : 0
          },
          markdown: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'resume.md')),
            path: '/downloads/resume.md',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'resume.md')) ? fs.statSync(path.join(this.options.downloadsDir, 'resume.md')).size : 0
          },
          json: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'resume.json')),
            path: '/downloads/resume.json',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'resume.json')) ? fs.statSync(path.join(this.options.downloadsDir, 'resume.json')).size : 0
          },
          html: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'resume.html')),
            path: '/downloads/resume.html',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'resume.html')) ? fs.statSync(path.join(this.options.downloadsDir, 'resume.html')).size : 0
          },
          coverLetter: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'cover_letter.md')),
            path: '/downloads/cover_letter.md',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'cover_letter.md')) ? fs.statSync(path.join(this.options.downloadsDir, 'cover_letter.md')).size : 0
          },
          coverLetterHtml: {
            available: fs.existsSync(path.join(this.options.downloadsDir, 'cover_letter.html')),
            path: '/downloads/cover_letter.html',
            size: fs.existsSync(path.join(this.options.downloadsDir, 'cover_letter.html')) ? fs.statSync(path.join(this.options.downloadsDir, 'cover_letter.html')).size : 0
          }
        },
        tests: {
          allFormatsAvailable: true,
          totalSize: 0,
          formatCount: 0
        },
        // Add extraction information
        extraction: {
          performed: extractionResult.success,
          timestamp: new Date(fs.statSync(path.join(this.options.extractedDir, 'extraction_metadata.json')).mtime).toISOString(),
          cached: extractionResult.cached || false,
          contentFingerprint: extractionResult.contentFingerprint || ''
        },
        // Add OpenAI analysis information
        analysis: {
          performed: analysisResult.success,
          timestamp: analysisResult.validationResult?.timestamp || new Date().toISOString(),
          model: this.options.model || 'gpt-4o',
          cached: analysisResult.cached || false,
          simulated: analysisResult.simulated || false,
          fallback: !analysisResult.success
        },
        // Add validation results
        validation: analysisResult.validationResult || {
          success: false,
          error: 'Validation results not available',
          timestamp: new Date().toISOString()
        }
      };
      
      // Calculate test metrics
      let totalSize = 0;
      let formatCount = 0;
      let allFormatsAvailable = true;
      
      for (const [format, info] of Object.entries(testReport.formats)) {
        if (info.available) {
          totalSize += info.size;
          formatCount++;
        } else {
          allFormatsAvailable = false;
        }
      }
      
      testReport.tests.totalSize = totalSize;
      testReport.tests.formatCount = formatCount;
      testReport.tests.allFormatsAvailable = allFormatsAvailable;
      
      // Save the test report
      const testReportPath = path.join(this.options.publicDir, 'download_test_report.json');
      fs.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
      
      // Get the preview content
      const previewContentPath = path.join(this.options.downloadsDir, 'preview_content.json');
      let previewContent = null;
      
      if (fs.existsSync(previewContentPath)) {
        previewContent = JSON.parse(fs.readFileSync(previewContentPath, 'utf8'));
      } else {
        previewContent = {
          timestamp: new Date().toISOString(),
          formats: {
            text: 'Preview content not available',
            markdown: 'Preview content not available',
            json: '{}',
            coverLetter: 'Preview content not available'
          }
        };
        
        fs.writeFileSync(previewContentPath, JSON.stringify(previewContent, null, 2));
      }
      
      hesseLogger.summary.complete('Test report generation completed successfully');
      danteLogger.success.perfection('Test report generation completed successfully');
      
      return {
        success: true,
        reportPath: testReportPath,
        previewPath: previewContentPath,
        report: testReport,
        preview: previewContent
      };
    } catch (error) {
      hesseLogger.summary.error(`Error generating test report: ${error.message}`);
      danteLogger.error.system('Error generating test report', error);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

module.exports = TestReportGenerator;
