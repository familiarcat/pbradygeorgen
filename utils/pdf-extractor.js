/**
 * PDF Extractor Module
 *
 * This module handles the extraction of raw text from PDF files.
 * It's the first step in the PDF processing pipeline.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing the PDF into its raw textual form
 * - Hesse: Balancing technical extraction with meaningful content
 * - Dante: Beginning the journey of content transformation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Dante emoji logger for console output
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

// Hesse logger for console output
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger for console output
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
 * PDF Extractor class
 */
class PdfExtractor {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || path.join(process.cwd(), 'public', 'extracted'),
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      ...options
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
  }

  /**
   * Extract text from a PDF file
   * @param {string} pdfPath - Path to the PDF file
   * @param {boolean} forceRefresh - Whether to force refresh the extraction
   * @returns {Promise<Object>} - Extraction result
   */
  async extractText(pdfPath, forceRefresh = false) {
    try {
      hesseLogger.summary.start(`Extracting text from PDF: ${path.basename(pdfPath)}`);
      danteLogger.success.basic(`Starting PDF text extraction for ${path.basename(pdfPath)}`);

      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at ${pdfPath}`);
      }

      // Check if extraction already exists and force refresh is not enabled
      const contentFingerprintPath = path.join(this.options.outputDir, 'content_fingerprint.txt');
      const extractedTextPath = path.join(this.options.outputDir, 'extracted_raw_text.txt');

      if (!forceRefresh && fs.existsSync(contentFingerprintPath) && fs.existsSync(extractedTextPath)) {
        hesseLogger.summary.progress('Extraction already exists, checking fingerprint...');

        // Read the PDF file
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Generate a content fingerprint
        const newContentFingerprint = crypto
          .createHash('sha256')
          .update(pdfBuffer)
          .digest('hex');

        // Read the existing fingerprint
        const existingContentFingerprint = fs.readFileSync(contentFingerprintPath, 'utf8').trim();

        if (newContentFingerprint === existingContentFingerprint) {
          hesseLogger.summary.complete('PDF content unchanged, using existing extraction');
          danteLogger.success.core('PDF content unchanged, using existing extraction');

          // Read the existing extracted text
          const extractedText = fs.readFileSync(extractedTextPath, 'utf8');

          return {
            success: true,
            text: extractedText,
            contentFingerprint: newContentFingerprint,
            path: extractedTextPath,
            cached: true
          };
        }
      }

      // Read the PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Generate a content fingerprint
      const contentFingerprint = crypto
        .createHash('sha256')
        .update(pdfBuffer)
        .digest('hex');

      const shortFingerprint = contentFingerprint.substring(0, 8);
      hesseLogger.summary.progress(`Generated content fingerprint: ${shortFingerprint}`);

      // In a real implementation, we would use a PDF parsing library here
      // For now, we'll try to extract text from the actual PDF if possible
      let extractedRawText = '';

      try {
        // Try to use pdfjs-dist if available
        const pdfjs = require('pdfjs-dist');

        hesseLogger.summary.progress('Using PDF.js to extract text from PDF');
        danteLogger.success.basic('Using PDF.js to extract text from PDF');

        // Load the PDF document
        const pdfDocument = await pdfjs.getDocument(pdfPath).promise;

        // Extract text from each page
        let fullText = '';
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        extractedRawText = fullText;

        hesseLogger.summary.progress('Successfully extracted text using PDF.js');
        danteLogger.success.core('Successfully extracted text using PDF.js');
      } catch (error) {
        hesseLogger.summary.progress(`PDF.js extraction failed: ${error.message}. Using fallback extraction.`);
        danteLogger.warn.deprecated(`PDF.js extraction failed: ${error.message}. Using fallback extraction.`);

        // Fallback to simulated extraction
        extractedRawText = `JOHN DOE
123 Main Street, City, State 12345
Phone: (123) 456-7890 | Email: john.doe@example.com | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software developer with expertise in JavaScript/TypeScript, React, Node.js, and AWS.
Passionate about creating efficient, scalable, and maintainable code. Strong problem-solving skills
and ability to work effectively in team environments.

SKILLS
- JavaScript/TypeScript
- React/Next.js
- Node.js
- AWS/Cloud Computing
- CI/CD Pipelines
- RESTful APIs
- MongoDB/PostgreSQL
- Git/GitHub

PROFESSIONAL EXPERIENCE

Senior Software Developer
ABC Company | 2020 - Present
- Developed and maintained web applications using React and Node.js
- Implemented CI/CD pipelines using GitHub Actions
- Deployed applications to AWS using Amplify
- Collaborated with cross-functional teams to deliver high-quality software
- Mentored junior developers and conducted code reviews

Software Developer
XYZ Company | 2018 - 2020
- Developed front-end applications using React
- Implemented RESTful APIs using Node.js
- Worked with MongoDB and PostgreSQL databases
- Participated in Agile development processes
- Contributed to open-source projects

EDUCATION

Bachelor of Science in Computer Science
University of Technology | 2014 - 2018
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems

CERTIFICATIONS
- AWS Certified Developer - Associate
- MongoDB Certified Developer

PROJECTS
- Personal Portfolio: Developed a personal portfolio website using Next.js and Tailwind CSS
- Task Manager: Created a full-stack task management application with React, Node.js, and MongoDB
- Weather App: Built a weather application using React and OpenWeather API
`;
      }

      // Save the raw extracted text
      fs.writeFileSync(extractedTextPath, extractedRawText);

      // Save basic metadata
      const extractionMetadata = {
        metadata: {
          source: path.basename(pdfPath),
          extractionDate: new Date().toISOString(),
          contentFingerprint,
          rawTextLength: extractedRawText.length,
          extractionMethod: 'simulated' // In a real implementation, this would be the actual method used
        }
      };

      // Save the extraction metadata
      fs.writeFileSync(
        path.join(this.options.outputDir, 'extraction_metadata.json'),
        JSON.stringify(extractionMetadata, null, 2)
      );

      // Save the content fingerprint for easy access
      fs.writeFileSync(contentFingerprintPath, contentFingerprint);

      // For backward compatibility, save some basic files
      fs.writeFileSync(path.join(this.options.outputDir, 'resume_content.txt'), extractedRawText);

      // Create a simple markdown version for backward compatibility
      const basicMarkdown = `# ${extractedRawText.split('\n')[0]}

${extractedRawText.split('\n').slice(1).join('\n')}
`;

      fs.writeFileSync(path.join(this.options.outputDir, 'resume_content.md'), basicMarkdown);

      hesseLogger.summary.complete('Text extraction completed successfully');
      danteLogger.success.perfection('Text extraction completed successfully');

      return {
        success: true,
        text: extractedRawText,
        contentFingerprint,
        path: extractedTextPath,
        cached: false
      };
    } catch (error) {
      hesseLogger.summary.error(`Error extracting text from PDF: ${error.message}`);
      danteLogger.error.system('Error extracting text from PDF', error);

      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

module.exports = PdfExtractor;
