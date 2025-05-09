/**
 * S3 PDF Extractor Module
 *
 * This module handles the extraction of raw text from PDF files and stores the results in S3.
 * It's the first step in the PDF processing pipeline, establishing S3 as the single source of truth.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing the PDF into its raw textual form
 * - Hesse: Balancing technical extraction with meaningful content
 * - Salinger: Ensuring authentic representation by rejecting caching in favor of truth
 * - Dante: Beginning the journey of content transformation
 */

const fs = require('fs');
const path = require('path');
const { S3StorageManager } = require('./s3StorageManager.js');
// Create simple console loggers for now
const DanteLogger = {
  success: {
    basic: (message) => console.log(`😇☀️: ${message}`),
    core: (message) => console.log(`😇🌟: ${message}`),
    perfection: (message) => console.log(`😇🌈: ${message}`)
  },
  error: {
    system: (message, error) => console.error(`👑💢: ${message}${error ? ': ' + error : ''}`),
    dataFlow: (message) => console.error(`⚠️⚡: ${message}`),
    validation: (message) => console.error(`⚠️🔥: ${message}`)
  },
  warn: {
    deprecated: (message) => console.warn(`⚠️🌊: ${message}`),
    performance: (message) => console.warn(`⚠️⏱️: ${message}`),
    security: (message) => console.warn(`⚠️🔒: ${message}`)
  }
};

const HesseLogger = {
  summary: {
    start: (message) => console.log(`🔍 [Hesse:Summary:Start] ${message}`),
    progress: (message) => console.log(`⏳ [Hesse:Summary:Progress] ${message}`),
    complete: (message) => console.log(`✅ [Hesse:Summary:Complete] ${message}`),
    error: (message) => console.error(`❌ [Hesse:Summary:Error] ${message}`)
  }
};

/**
 * S3 PDF Extractor class
 */
class S3PdfExtractor {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      forceOverwrite: options.forceOverwrite || false,
      ...options
    };

    // Get the S3 Storage Manager instance
    this.s3Manager = S3StorageManager.getInstance();
  }

  /**
   * Extract text from a PDF file and store in S3
   * @param {string} pdfPath - Path to the PDF file
   * @param {boolean} forceRefresh - Whether to force refresh the extraction
   * @returns {Promise<Object>} - Extraction result
   */
  async extractText(pdfPath, forceRefresh = false) {
    try {
      HesseLogger.summary.start(`Extracting text from PDF: ${path.basename(pdfPath)}`);
      DanteLogger.success.basic(`Starting PDF text extraction for ${path.basename(pdfPath)}`);

      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at ${pdfPath}`);
      }

      // Read the PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Generate a content fingerprint
      const contentFingerprint = this.s3Manager.generateContentFingerprint(pdfBuffer);
      const shortFingerprint = contentFingerprint.substring(0, 8);

      HesseLogger.summary.progress(`Generated content fingerprint: ${shortFingerprint}`);
      DanteLogger.success.basic(`Generated content fingerprint: ${shortFingerprint}`);

      // Define S3 keys for the PDF and extracted content
      const pdfS3Key = this.s3Manager.getPdfS3Key(contentFingerprint, path.basename(pdfPath));
      const extractedTextS3Key = this.s3Manager.getExtractedContentS3Key(contentFingerprint, 'extracted_raw_text.txt');
      const extractedMarkdownS3Key = this.s3Manager.getExtractedContentS3Key(contentFingerprint, 'resume_content.md');
      const metadataS3Key = this.s3Manager.getExtractedContentS3Key(contentFingerprint, 'extraction_metadata.json');

      // Check if extraction already exists and force refresh is not enabled
      if (!forceRefresh && !this.options.forceOverwrite) {
        const existsResult = await this.s3Manager.fileExists(extractedTextS3Key);

        if (existsResult.success && existsResult.exists) {
          HesseLogger.summary.progress('Extraction already exists in S3, using existing extraction');
          DanteLogger.success.core('Extraction already exists in S3, using existing extraction');

          // Download the existing extracted text
          const downloadResult = await this.s3Manager.downloadText(extractedTextS3Key);

          if (downloadResult.success && downloadResult.content) {
            return {
              success: true,
              text: downloadResult.content,
              contentFingerprint,
              s3Key: extractedTextS3Key,
              cached: true,
              metadata: downloadResult.metadata
            };
          }
        }
      }

      // Upload the PDF to S3 first
      HesseLogger.summary.progress(`Uploading PDF to S3: ${pdfS3Key}`);
      DanteLogger.success.basic(`Uploading PDF to S3: ${pdfS3Key}`);

      const pdfUploadResult = await this.s3Manager.uploadFile(
        pdfBuffer,
        pdfS3Key,
        'application/pdf',
        { contentFingerprint, originalFilename: path.basename(pdfPath) }
      );

      if (!pdfUploadResult.success) {
        throw new Error(`Failed to upload PDF to S3: ${pdfUploadResult.message}`);
      }

      // Extract text from the PDF
      HesseLogger.summary.progress('Extracting text from PDF');
      DanteLogger.success.basic('Extracting text from PDF');

      let extractedRawText = '';

      try {
        // Try to use pdfjs-dist if available
        const pdfjs = require('pdfjs-dist');

        HesseLogger.summary.progress('Using PDF.js to extract text from PDF');
        DanteLogger.success.basic('Using PDF.js to extract text from PDF');

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

        HesseLogger.summary.progress('Successfully extracted text using PDF.js');
        DanteLogger.success.core('Successfully extracted text using PDF.js');
      } catch (error) {
        HesseLogger.summary.progress(`PDF.js extraction failed: ${error.message}. Using fallback extraction.`);
        DanteLogger.warn.deprecated(`PDF.js extraction failed: ${error.message}. Using fallback extraction.`);

        try {
          // Try to use pdf-parse if available
          const pdfParse = require('pdf-parse');

          HesseLogger.summary.progress('Using pdf-parse to extract text from PDF');
          DanteLogger.success.basic('Using pdf-parse to extract text from PDF');

          const data = await pdfParse(pdfBuffer);
          extractedRawText = data.text || '';

          HesseLogger.summary.progress('Successfully extracted text using pdf-parse');
          DanteLogger.success.core('Successfully extracted text using pdf-parse');
        } catch (pdfParseError) {
          HesseLogger.summary.progress(`pdf-parse extraction failed: ${pdfParseError.message}. Using fallback content.`);
          DanteLogger.error.dataFlow(`pdf-parse extraction failed: ${pdfParseError.message}. Using fallback content.`);

          // Fallback to error message - we don't want to use default content anymore
          extractedRawText = `ERROR: Failed to extract text from PDF.

PDF.js Error: ${error.message}
pdf-parse Error: ${pdfParseError.message}

Please check the PDF file and try again.`;
        }
      }

      // Create extraction metadata
      const extractionMetadata = {
        source: path.basename(pdfPath),
        extractionDate: new Date().toISOString(),
        contentFingerprint,
        rawTextLength: extractedRawText.length,
        extractionMethod: 'pdf.js',
        s3Storage: true
      };

      // Upload the extracted text to S3
      HesseLogger.summary.progress(`Uploading extracted text to S3: ${extractedTextS3Key}`);
      DanteLogger.success.basic(`Uploading extracted text to S3: ${extractedTextS3Key}`);

      const textUploadResult = await this.s3Manager.uploadText(
        extractedRawText,
        extractedTextS3Key,
        extractionMetadata
      );

      if (!textUploadResult.success) {
        throw new Error(`Failed to upload extracted text to S3: ${textUploadResult.message}`);
      }

      // Create a simple markdown version
      const extractedMarkdown = `# ${extractedRawText.split('\n')[0] || 'Extracted Content'}

${extractedRawText.split('\n').slice(1).join('\n')}
`;

      // Upload the markdown to S3
      HesseLogger.summary.progress(`Uploading markdown to S3: ${extractedMarkdownS3Key}`);
      DanteLogger.success.basic(`Uploading markdown to S3: ${extractedMarkdownS3Key}`);

      const markdownUploadResult = await this.s3Manager.uploadMarkdown(
        extractedMarkdown,
        extractedMarkdownS3Key,
        extractionMetadata
      );

      if (!markdownUploadResult.success) {
        throw new Error(`Failed to upload markdown to S3: ${markdownUploadResult.message}`);
      }

      // Upload the metadata to S3
      HesseLogger.summary.progress(`Uploading metadata to S3: ${metadataS3Key}`);
      DanteLogger.success.basic(`Uploading metadata to S3: ${metadataS3Key}`);

      const metadataUploadResult = await this.s3Manager.uploadJson(
        extractionMetadata,
        metadataS3Key
      );

      if (!metadataUploadResult.success) {
        throw new Error(`Failed to upload metadata to S3: ${metadataUploadResult.message}`);
      }

      HesseLogger.summary.complete('Text extraction and S3 upload completed successfully');
      DanteLogger.success.perfection('Text extraction and S3 upload completed successfully');

      return {
        success: true,
        text: extractedRawText,
        contentFingerprint,
        s3Key: extractedTextS3Key,
        cached: false,
        metadata: extractionMetadata
      };
    } catch (error) {
      HesseLogger.summary.error(`Error extracting text from PDF: ${error.message}`);
      DanteLogger.error.system('Error extracting text from PDF', error);

      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

module.exports = S3PdfExtractor;
