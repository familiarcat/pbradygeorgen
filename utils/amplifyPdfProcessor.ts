/**
 * AWS Amplify Compatible PDF Processor
 * 
 * This module provides PDF processing functions that work in AWS Amplify's environment.
 * It avoids using child_process.exec and handles file paths in a way that's compatible
 * with AWS Amplify's serverless environment.
 */

import fs from 'fs';
import path from 'path';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import crypto from 'crypto';
import { ContentStateService } from './ContentStateService';

// Import pdf-parse directly instead of using child_process
let pdfParse: any;
try {
  // Dynamic import to avoid issues during build time
  pdfParse = require('pdf-parse');
} catch (error) {
  console.error('Failed to import pdf-parse:', error);
}

/**
 * Process a PDF file in a way that's compatible with AWS Amplify
 * 
 * @param pdfPath Path to the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the processing results
 */
export async function processPdfForAmplify(pdfPath: string, forceRefresh: boolean = false): Promise<{
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
    HesseLogger.summary.start('Processing PDF content for Amplify');
    DanteLogger.success.basic('Starting Amplify-compatible PDF processing');

    // 1. Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      const error = `PDF file not found at ${pdfPath}`;
      console.error(error);
      DanteLogger.error.dataFlow(error);
      return { success: false, message: error };
    }

    // 2. Get the content state service
    const contentStateService = ContentStateService.getInstance();

    // 3. Get PDF metadata
    const stats = fs.statSync(pdfPath);
    const pdfSize = stats.size;
    const pdfModified = stats.mtime;
    const pdfBuffer = fs.readFileSync(pdfPath);

    // 4. Generate content fingerprint
    const contentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);

    // 5. Check if we need to refresh the content
    let needsRefresh = forceRefresh;

    // Check if the content is stale by comparing fingerprints
    const storedFingerprint = contentStateService.getFingerprint();

    if (contentFingerprint !== storedFingerprint) {
      console.log(`PDF content is stale: fingerprint changed`);
      DanteLogger.warn.deprecated('PDF content is stale, refreshing');
      needsRefresh = true;

      // Update the content state with the new fingerprint
      contentStateService.updateState({
        fingerprint: contentFingerprint,
        pdfPath,
        pdfSize,
        pdfLastModified: pdfModified,
        isProcessed: false,
        isAnalyzed: false
      });
    }

    // 6. Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // 7. Extract content from the PDF if needed
    let extractedContent: any = null;
    if (needsRefresh) {
      console.log('Extracting content from PDF directly (Amplify-compatible)');
      HesseLogger.summary.progress('Extracting content from PDF');
      DanteLogger.success.basic('Extracting content from PDF directly');

      // Extract text directly using pdf-parse instead of using a child process
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
        text = text.replace(/\s+/g, ' ').trim();

        // Split into lines and remove empty lines
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        text = lines.join('\n');

        // Save the raw text to a file
        const outputPath = path.join(extractedDir, 'resume_content.txt');
        fs.writeFileSync(outputPath, text);

        // Create a simple markdown version
        const markdownPath = path.join(extractedDir, 'resume_content.md');
        const markdown = `# Resume Content\n\n${text}`;
        fs.writeFileSync(markdownPath, markdown);

        // Create a simple JSON structure
        const jsonContent = {
          metadata: {
            source: path.basename(pdfPath),
            extractionDate: new Date().toISOString(),
            pageCount: data.numpages || 0,
            info: data.info || {},
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

        // Save the JSON content
        const jsonPath = path.join(extractedDir, 'resume_content.json');
        fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));

        // Save the content fingerprint
        const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
        fs.writeFileSync(fingerprintPath, contentFingerprint);

        // Create a log file
        const logPath = path.join(extractedDir, 'extraction_log.json');
        const logContent = {
          timestamp: new Date().toISOString(),
          pdfPath,
          pdfSize,
          pdfModified: pdfModified.toISOString(),
          contentFingerprint,
          extractionTime: Date.now() - extractionStart,
          success: true
        };
        fs.writeFileSync(logPath, JSON.stringify(logContent, null, 2));

        // Create a summary file
        const summaryPath = path.join(extractedDir, 'extraction_summary.txt');
        const summaryContent = `PDF Extraction Summary
Timestamp: ${new Date().toISOString()}
PDF Path: ${pdfPath}
PDF Size: ${pdfSize} bytes
Content Fingerprint: ${contentFingerprint}
Extraction Time: ${Date.now() - extractionStart}ms
Success: true
`;
        fs.writeFileSync(summaryPath, summaryContent);

        extractedContent = jsonContent;
        
        const extractionTime = Date.now() - extractionStart;
        console.log(`⏱️ Text extraction completed in ${extractionTime}ms`);
        DanteLogger.success.core(`Text extraction completed in ${extractionTime}ms`);
        
      } catch (error) {
        console.error('Error extracting PDF content directly:', error);
        DanteLogger.error.dataFlow(`Error extracting PDF content directly: ${error}`);
        
        // Try to use a fallback approach - read existing content if available
        const jsonPath = path.join(extractedDir, 'resume_content.json');
        if (fs.existsSync(jsonPath)) {
          console.log('Using existing content as fallback');
          DanteLogger.warn.deprecated('Using existing content as fallback');
          try {
            const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            extractedContent = jsonContent;
          } catch (fallbackError) {
            console.error('Error reading fallback content:', fallbackError);
            DanteLogger.error.dataFlow(`Error reading fallback content: ${fallbackError}`);
            return { 
              success: false, 
              message: 'Error extracting content and fallback failed', 
              error: error 
            };
          }
        } else {
          return { 
            success: false, 
            message: 'Error extracting content', 
            error: error 
          };
        }
      }
    } else {
      // Read the existing content
      console.log('Using existing content (content is fresh)');
      DanteLogger.success.basic('Using existing content (content is fresh)');
      
      try {
        const jsonPath = path.join(extractedDir, 'resume_content.json');
        if (fs.existsSync(jsonPath)) {
          const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          extractedContent = jsonContent;
        } else {
          console.error('Existing content not found');
          DanteLogger.error.dataFlow('Existing content not found');
          return { 
            success: false, 
            message: 'Existing content not found', 
          };
        }
      } catch (error) {
        console.error('Error reading existing content:', error);
        DanteLogger.error.dataFlow(`Error reading existing content: ${error}`);
        return { 
          success: false, 
          message: 'Error reading existing content', 
          error: error 
        };
      }
    }

    // 8. Create a simple analyzed content if it doesn't exist
    const analyzedContentPath = path.join(extractedDir, 'resume_content_analyzed.json');
    let analyzedContent: any = null;
    
    if (needsRefresh || !fs.existsSync(analyzedContentPath)) {
      console.log('Creating simple analyzed content');
      DanteLogger.success.basic('Creating simple analyzed content');
      
      // Create a simple analyzed content
      analyzedContent = {
        metadata: {
          source: path.basename(pdfPath),
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
      
      // Save the analyzed content
      fs.writeFileSync(analyzedContentPath, JSON.stringify(analyzedContent, null, 2));
    } else {
      // Read the existing analyzed content
      console.log('Using existing analyzed content');
      DanteLogger.success.basic('Using existing analyzed content');
      
      try {
        analyzedContent = JSON.parse(fs.readFileSync(analyzedContentPath, 'utf8'));
      } catch (error) {
        console.error('Error reading existing analyzed content:', error);
        DanteLogger.error.dataFlow(`Error reading existing analyzed content: ${error}`);
        
        // Create a simple analyzed content as fallback
        analyzedContent = {
          metadata: {
            source: path.basename(pdfPath),
            analysisDate: new Date().toISOString(),
            contentFingerprint,
            isFallback: true
          },
          structuredContent: {
            name: extractedContent?.structuredContent?.name || "Extracted Content",
            summary: extractedContent?.structuredContent?.summary || "",
            skills: extractedContent?.structuredContent?.skills || [],
            experience: extractedContent?.structuredContent?.experience || []
          }
        };
        
        // Save the analyzed content
        fs.writeFileSync(analyzedContentPath, JSON.stringify(analyzedContent, null, 2));
      }
    }

    // 9. Create a simple cover letter if it doesn't exist
    const coverLetterPath = path.join(extractedDir, 'cover_letter.md');
    if (needsRefresh || !fs.existsSync(coverLetterPath)) {
      console.log('Creating simple cover letter');
      DanteLogger.success.basic('Creating simple cover letter');
      
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
      
      // Save the cover letter
      fs.writeFileSync(coverLetterPath, coverLetterContent);
    }

    // 10. Update the content state
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
    console.error('Error processing PDF:', error);
    HesseLogger.summary.error(`Error processing PDF: ${error}`);
    DanteLogger.error.system('Error processing PDF', error);

    return {
      success: false,
      message: `Error processing PDF: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

export default {
  processPdfForAmplify
};
