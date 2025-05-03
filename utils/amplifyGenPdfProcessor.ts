/**
 * Amplify Gen2-Compatible PDF Processor
 *
 * This module provides PDF processing functions that work with Amplify Gen2 Storage,
 * making it compatible with AWS Amplify's read-only file system constraints.
 *
 * Philosophical Framework:
 * - Hesse: Balancing structure (Amplify Storage) with flexibility (dynamic content)
 * - Salinger: Ensuring authentic representation through content versioning
 * - Derrida: Deconstructing content into structured storage paths
 * - Dante: Guiding the content through different processing stages
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { AmplifyStorageService } from './amplifyStorageService';
import { ContentStateService } from './ContentStateService';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Import pdf-parse directly instead of using child_process
let pdfParse: any;
try {
  // Dynamic import to avoid issues during build time
  pdfParse = require('pdf-parse');
} catch (error) {
  console.error('Failed to import pdf-parse:', error);
}

/**
 * Process a PDF file using Amplify Storage
 *
 * @param pdfPath Path to the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the processing results
 */
export async function processPdfWithAmplify(pdfPath: string, forceRefresh: boolean = false): Promise<{
  success: boolean;
  message: string;
  contentFingerprint?: string;
  extractedContent?: any;
  analyzedContent?: any;
  validationResult?: any;
  error?: any;
}> {
  try {
    console.log('Starting Amplify-compatible PDF processing pipeline');
    HesseLogger.summary.start('Processing PDF content with Amplify');
    DanteLogger.success.basic('Starting Amplify-compatible PDF processing');

    // 1. Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      const error = `PDF file not found at ${pdfPath}`;
      console.error(error);
      DanteLogger.error.dataFlow(error);
      return { success: false, message: error };
    }

    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [AmplifyPdfProcessor] Processing PDF: ${pdfPath}`);
      console.log(`🔍 [AmplifyPdfProcessor] Force refresh: ${forceRefresh}`);
    }

    // 2. Get the Amplify storage service
    const amplifyStorageService = AmplifyStorageService.getInstance();

    // 3. Get the content state service
    const contentStateService = ContentStateService.getInstance();

    // 4. Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfName = path.basename(pdfPath);

    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [AmplifyPdfProcessor] PDF name: ${pdfName}`);
      console.log(`🔍 [AmplifyPdfProcessor] PDF size: ${pdfBuffer.length} bytes`);
    }

    // 5. Generate content fingerprint
    const contentFingerprint = amplifyStorageService.generateContentFingerprint(pdfBuffer);

    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [AmplifyPdfProcessor] Content fingerprint: ${contentFingerprint}`);
    }

    // 6. Check if we need to refresh the content
    let needsRefresh = forceRefresh;

    // Check if the content is stale by comparing fingerprints
    const storedFingerprint = contentStateService.getFingerprint();

    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [AmplifyPdfProcessor] Stored fingerprint: ${storedFingerprint}`);
      console.log(`🔍 [AmplifyPdfProcessor] Fingerprints match: ${contentFingerprint === storedFingerprint}`);
    }

    if (contentFingerprint !== storedFingerprint) {
      console.log(`PDF content is stale: fingerprint changed`);
      DanteLogger.warn.deprecated('PDF content is stale, refreshing');
      needsRefresh = true;

      if (process.env.DEBUG_LOGGING === 'true') {
        console.log(`🔍 [AmplifyPdfProcessor] Updating content state with new fingerprint`);
      }

      // Update the content state with the new fingerprint
      contentStateService.updateState({
        fingerprint: contentFingerprint,
        pdfPath,
        isProcessed: false,
        isAnalyzed: false
      });
    }

    // 7. Check if the PDF already exists in storage
    const pdfStorageKey = amplifyStorageService.getPdfStorageKey(contentFingerprint, pdfName);
    const pdfExistsResult = await amplifyStorageService.fileExists(pdfStorageKey);

    // 8. Upload the PDF to storage if it doesn't exist or if we need to refresh
    if (needsRefresh || !pdfExistsResult.exists) {
      if (amplifyStorageService.isAmplifyStorageReady() && amplifyStorageService.shouldUseAmplifyStorage()) {
        console.log(`Uploading PDF to Amplify Storage: ${pdfName}`);
        DanteLogger.success.basic(`Uploading PDF to Amplify Storage: ${pdfName}`);

        const uploadResult = await amplifyStorageService.uploadPdf(pdfPath, pdfName);

        if (!uploadResult.success) {
          throw new Error(`Failed to upload PDF to storage: ${uploadResult.message}`);
        }

        console.log(`PDF uploaded to Amplify Storage: ${uploadResult.key}`);
        DanteLogger.success.core(`PDF uploaded to Amplify Storage: ${uploadResult.key}`);
      } else {
        console.log(`Saving PDF locally: ${pdfName}`);
        DanteLogger.success.basic(`Saving PDF locally: ${pdfName}`);

        // Just use the file directly from the file system
        console.log(`Using PDF from local file system: ${pdfPath}`);
        DanteLogger.success.core(`Using PDF from local file system: ${pdfPath}`);
      }
    } else {
      if (amplifyStorageService.isAmplifyStorageReady() && amplifyStorageService.shouldUseAmplifyStorage()) {
        console.log(`PDF already exists in Amplify Storage: ${pdfStorageKey}`);
        DanteLogger.success.basic(`PDF already exists in Amplify Storage: ${pdfStorageKey}`);
      } else {
        console.log(`PDF already exists locally: ${pdfExistsResult.localPath}`);
        DanteLogger.success.basic(`PDF already exists locally: ${pdfExistsResult.localPath}`);
      }
    }

    // 9. Check if extracted content exists in storage
    const extractedJsonStorageKey = amplifyStorageService.getExtractedContentStorageKey(contentFingerprint, 'resume_content.json');
    const extractedJsonExistsResult = await amplifyStorageService.fileExists(extractedJsonStorageKey);

    // 10. Extract content from the PDF if needed
    let extractedContent: any = null;

    if (needsRefresh || !extractedJsonExistsResult.exists) {
      console.log('Extracting content from PDF');
      HesseLogger.summary.progress('Extracting content from PDF');
      DanteLogger.success.basic('Extracting content from PDF');

      // Extract text directly using pdf-parse
      try {
        if (!pdfParse) {
          throw new Error('pdf-parse module not available');
        }

        const extractionStart = Date.now();

        // Parse the PDF directly
        const data = await pdfParse(pdfBuffer);

        // Get the text content
        let text = data.text || '';

        // Additional processing to clean up the text
        // Remove excessive whitespace
        text = text.replace(/\\s+/g, ' ').trim();

        // Split into lines and remove empty lines
        const lines = text.split('\\n').map(line => line.trim()).filter(line => line);
        text = lines.join('\\n');

        // Create a simple JSON structure
        const jsonContent = {
          metadata: {
            source: pdfName,
            extractionDate: new Date().toISOString(),
            pageCount: data.numpages || 0,
            info: data.info || {},
            contentFingerprint,
            usedFallback: false
          },
          rawText: text,
          sections: [],
          structuredContent: {
            name: "Extracted Content",
            summary: text.substring(0, 200) + "...",
            skills: [],
            experience: []
          }
        };

        // Upload the JSON content to storage
        const uploadJsonResult = await amplifyStorageService.uploadJson(
          jsonContent,
          extractedJsonStorageKey
        );

        if (!uploadJsonResult.success) {
          throw new Error(`Failed to upload extracted JSON to storage: ${uploadJsonResult.message}`);
        }

        // Upload the raw text to storage
        const extractedTextStorageKey = amplifyStorageService.getExtractedContentStorageKey(contentFingerprint, 'resume_content.txt');
        await amplifyStorageService.uploadText(text, extractedTextStorageKey);

        // Create a simple markdown version
        const markdown = `# Resume Content\\n\\n${text}`;
        const extractedMarkdownStorageKey = amplifyStorageService.getExtractedContentStorageKey(contentFingerprint, 'resume_content.md');
        await amplifyStorageService.uploadMarkdown(markdown, extractedMarkdownStorageKey);

        // Upload the content fingerprint
        const fingerprintStorageKey = amplifyStorageService.getExtractedContentStorageKey(contentFingerprint, 'content_fingerprint.txt');
        await amplifyStorageService.uploadText(contentFingerprint, fingerprintStorageKey);

        // Create a log file
        const logContent = {
          timestamp: new Date().toISOString(),
          pdfPath,
          pdfName,
          contentFingerprint,
          extractionTime: Date.now() - extractionStart,
          success: true
        };

        const logStorageKey = amplifyStorageService.getExtractedContentStorageKey(contentFingerprint, 'extraction_log.json');
        await amplifyStorageService.uploadJson(logContent, logStorageKey);

        extractedContent = jsonContent;

        const extractionTime = Date.now() - extractionStart;
        console.log(`⏱️ Text extraction completed in ${extractionTime}ms`);
        DanteLogger.success.core(`Text extraction completed in ${extractionTime}ms`);

      } catch (error) {
        console.error('Error extracting PDF content directly:', error);
        DanteLogger.error.dataFlow(`Error extracting PDF content directly: ${error}`);

        // Try to use a fallback approach - read existing content if available
        try {
          const fallbackResult = await amplifyStorageService.downloadJson(extractedJsonStorageKey);

          if (fallbackResult.success && fallbackResult.data) {
            console.log('Using existing content as fallback');
            DanteLogger.warn.deprecated('Using existing content as fallback');
            extractedContent = fallbackResult.data;
          } else {
            throw new Error('Fallback content not available');
          }
        } catch (fallbackError) {
          console.error('Error reading fallback content:', fallbackError);
          DanteLogger.error.dataFlow(`Error reading fallback content: ${fallbackError}`);

          // Create a minimal fallback content
          const fallbackContent = {
            metadata: {
              source: pdfName,
              extractionDate: new Date().toISOString(),
              contentFingerprint,
              isFallback: true
            },
            rawText: "Failed to extract content from PDF",
            sections: [],
            structuredContent: {
              name: "Fallback Content",
              summary: "Failed to extract content from PDF",
              skills: [],
              experience: []
            }
          };

          // Upload the fallback content to storage
          await amplifyStorageService.uploadJson(fallbackContent, extractedJsonStorageKey);

          extractedContent = fallbackContent;
        }
      }
    } else {
      // Download the existing content from storage
      console.log('Using existing content from storage (content is fresh)');
      DanteLogger.success.basic('Using existing content from storage (content is fresh)');

      const downloadResult = await amplifyStorageService.downloadJson(extractedJsonStorageKey);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(`Failed to download extracted content from storage: ${downloadResult.message}`);
      }

      extractedContent = downloadResult.data;
    }

    // 11. Check if analyzed content exists in storage
    const analyzedJsonStorageKey = amplifyStorageService.getAnalyzedContentStorageKey(contentFingerprint, 'resume_content_analyzed.json');
    const analyzedJsonExistsResult = await amplifyStorageService.fileExists(analyzedJsonStorageKey);

    // 12. Create or download analyzed content
    let analyzedContent: any = null;

    if (needsRefresh || !analyzedJsonExistsResult.exists) {
      console.log('Creating analyzed content');
      DanteLogger.success.basic('Creating analyzed content');

      // Create a simple analyzed content
      analyzedContent = {
        metadata: {
          source: pdfName,
          analysisDate: new Date().toISOString(),
          contentFingerprint
        },
        structuredContent: {
          name: extractedContent?.structuredContent?.name || "Extracted Content",
          summary: extractedContent?.structuredContent?.summary || "",
          skills: extractedContent?.structuredContent?.skills || [],
          experience: extractedContent?.structuredContent?.experience || []
        }
      };

      // Upload the analyzed content to storage
      const uploadAnalyzedResult = await amplifyStorageService.uploadJson(
        analyzedContent,
        analyzedJsonStorageKey
      );

      if (!uploadAnalyzedResult.success) {
        throw new Error(`Failed to upload analyzed content to storage: ${uploadAnalyzedResult.message}`);
      }
    } else {
      // Download the existing analyzed content from storage
      console.log('Using existing analyzed content from storage');
      DanteLogger.success.basic('Using existing analyzed content from storage');

      const downloadResult = await amplifyStorageService.downloadJson(analyzedJsonStorageKey);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(`Failed to download analyzed content from storage: ${downloadResult.message}`);
      }

      analyzedContent = downloadResult.data;
    }

    // 13. Check if cover letter exists in storage
    const coverLetterStorageKey = amplifyStorageService.getCoverLetterStorageKey(contentFingerprint, 'cover_letter.md');
    const coverLetterExistsResult = await amplifyStorageService.fileExists(coverLetterStorageKey);

    // 14. Create or download cover letter
    if (needsRefresh || !coverLetterExistsResult.exists) {
      console.log('Creating cover letter');
      DanteLogger.success.basic('Creating cover letter');

      // Create a simple cover letter
      const name = analyzedContent?.structuredContent?.name || "Applicant";
      const summary = analyzedContent?.structuredContent?.summary || "";

      const coverLetterContent = `# Cover Letter for ${name}

## Summary

${summary}

## Skills

- Professional skills demonstrated through experience
- Technical expertise in relevant areas
- Strong communication and collaboration abilities

## Experience Highlights

- Successfully completed projects with measurable results
- Worked effectively in team environments
- Demonstrated leadership and initiative

## Why I'm a Great Fit

I believe my experience and skills align well with your requirements, and I'm excited about the opportunity to contribute to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to your organization.

Sincerely,
${name}
`;

      // Upload the cover letter to storage
      const uploadCoverLetterResult = await amplifyStorageService.uploadMarkdown(
        coverLetterContent,
        coverLetterStorageKey
      );

      if (!uploadCoverLetterResult.success) {
        throw new Error(`Failed to upload cover letter to storage: ${uploadCoverLetterResult.message}`);
      }
    }

    // 15. Update the content state
    contentStateService.updateState({
      isProcessed: true,
      isAnalyzed: true,
      processingStage: 'formatted',
      formatVersions: {
        ...contentStateService.getState().formatVersions,
        coverLetter: true
      }
    });

    console.log('PDF processing completed successfully');
    HesseLogger.summary.complete('PDF processing completed successfully');
    DanteLogger.success.perfection('PDF processing completed successfully');

    return {
      success: true,
      message: 'PDF processed successfully',
      contentFingerprint,
      extractedContent,
      analyzedContent
    };
  } catch (error) {
    console.error('Error processing PDF with Amplify:', error);
    HesseLogger.summary.error(`Error processing PDF with Amplify: ${error}`);
    DanteLogger.error.system('Error processing PDF with Amplify', error);

    return {
      success: false,
      message: `Error processing PDF with Amplify: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

/**
 * Get cover letter content from Amplify Storage or local file system
 *
 * @param contentFingerprint The content fingerprint
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the cover letter content
 */
export async function getCoverLetterFromAmplify(contentFingerprint: string, forceRefresh: boolean = false): Promise<{
  success: boolean;
  message: string;
  content?: string;
  isStale?: boolean;
  metadata?: any;
}> {
  try {
    // 1. Get the Amplify storage service
    const amplifyStorageService = AmplifyStorageService.getInstance();

    // Check if Amplify Storage is available
    const isAmplifyAvailable = amplifyStorageService.isAmplifyStorageReady() && amplifyStorageService.shouldUseAmplifyStorage();

    if (isAmplifyAvailable) {
      console.log('Getting cover letter from Amplify Storage');
      HesseLogger.summary.start('Getting cover letter from Amplify Storage');
      DanteLogger.success.basic('Getting cover letter from Amplify Storage');
    } else {
      console.log('Getting cover letter from local file system');
      HesseLogger.summary.start('Getting cover letter from local file system');
      DanteLogger.success.basic('Getting cover letter from local file system');
    }

    // 2. Get the content state service
    const contentStateService = ContentStateService.getInstance();

    // 3. Check if we need to refresh the content
    let needsRefresh = forceRefresh;

    // Check if the content is stale by comparing fingerprints
    const storedFingerprint = contentStateService.getFingerprint();

    if (contentFingerprint !== storedFingerprint) {
      console.log(`Content is stale: fingerprint changed`);
      DanteLogger.warn.deprecated('Content is stale, refreshing');
      needsRefresh = true;
    }

    // 4. Check if cover letter exists in storage
    const coverLetterStorageKey = amplifyStorageService.getCoverLetterStorageKey(contentFingerprint, 'cover_letter.md');
    const coverLetterExistsResult = await amplifyStorageService.fileExists(coverLetterStorageKey);

    // 5. Process the PDF if needed
    if (needsRefresh || !coverLetterExistsResult.exists) {
      if (isAmplifyAvailable) {
        console.log('Cover letter not found or refresh needed, processing PDF with Amplify');
        DanteLogger.warn.deprecated('Cover letter not found or refresh needed, processing PDF with Amplify');
      } else {
        console.log('Cover letter not found or refresh needed, processing PDF locally');
        DanteLogger.warn.deprecated('Cover letter not found or refresh needed, processing PDF locally');
      }

      // Find the PDF path
      const pdfPath = contentStateService.getState().pdfPath || path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Process the PDF
      const processingResult = await processPdfWithAmplify(pdfPath, true);

      if (!processingResult.success) {
        throw new Error(`Failed to process PDF: ${processingResult.message}`);
      }

      // Update the content fingerprint
      contentFingerprint = processingResult.contentFingerprint || contentFingerprint;
    }

    // 6. Download the cover letter from storage
    const coverLetterStorageKeyFinal = amplifyStorageService.getCoverLetterStorageKey(contentFingerprint, 'cover_letter.md');
    const downloadResult = await amplifyStorageService.downloadText(coverLetterStorageKeyFinal);

    if (!downloadResult.success || !downloadResult.data) {
      throw new Error(`Failed to download cover letter: ${downloadResult.message}`);
    }

    const coverLetterContent = downloadResult.data;

    if (isAmplifyAvailable) {
      console.log('Cover letter retrieved successfully from Amplify Storage');
      HesseLogger.summary.complete('Cover letter retrieved successfully from Amplify Storage');
      DanteLogger.success.core('Cover letter retrieved successfully from Amplify Storage');
    } else {
      console.log('Cover letter retrieved successfully from local file system');
      HesseLogger.summary.complete('Cover letter retrieved successfully from local file system');
      DanteLogger.success.core('Cover letter retrieved successfully from local file system');
    }

    // Prepare metadata based on storage type
    const metadata = isAmplifyAvailable ? {
      contentFingerprint,
      format: 'markdown',
      contentType: 'cover_letter',
      storageKey: coverLetterStorageKeyFinal,
      storageType: 'amplify'
    } : {
      contentFingerprint,
      format: 'markdown',
      contentType: 'cover_letter',
      localPath: downloadResult.localPath,
      storageType: 'local'
    };

    return {
      success: true,
      message: 'Cover letter retrieved successfully',
      content: coverLetterContent,
      isStale: needsRefresh,
      metadata
    };
  } catch (error) {
    console.error('Error getting cover letter:', error);
    HesseLogger.summary.error(`Error getting cover letter: ${error}`);
    DanteLogger.error.system('Error getting cover letter', error);

    return {
      success: false,
      message: `Error getting cover letter: ${error instanceof Error ? error.message : String(error)}`,
      isStale: true
    };
  }
}

export default {
  processPdfWithAmplify,
  getCoverLetterFromAmplify
};
