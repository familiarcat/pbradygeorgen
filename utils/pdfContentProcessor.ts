/**
 * PDF Content Processor
 *
 * This service handles the entire PDF processing pipeline:
 * 1. Extracts content from PDF
 * 2. Analyzes content with ChatGPT
 * 3. Validates the analyzed content against Zod schemas
 * 4. Saves the analyzed content for use in SSR
 *
 * Follows the philosophical approaches of:
 * - Hesse: Balancing structure and flexibility in content processing
 * - Salinger: Maintaining authenticity of the original content
 * - Derrida: Deconstructing content into meaningful structures
 * - Dante: Navigating through different "circles" of content processing
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { analyzeResumeContent } from './openaiPdfStructureService';
import { ContentStateService } from './ContentStateService';

// Promisify exec
const execAsync = promisify(exec);

// Define the schemas that match our TypeScript definitions
const ContactInfoSchema = z.object({
  text: z.string()
});

const ExperienceEntrySchema = z.object({
  period: z.string(),
  company: z.string(),
  title: z.string(),
  description: z.string().optional()
});

const EducationEntrySchema = z.object({
  degree: z.string().optional(),
  institution: z.string(),
  period: z.string().optional()
});

const ClientEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

const SkillEntrySchema = z.object({
  text: z.string()
});

// Schema for the sections object
const SectionsSchema = z.object({
  name: z.string(),
  header: z.array(z.string()),
  about: z.array(z.string()),
  contact: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  clients: z.array(z.string()),
  other: z.array(z.string())
});

// Schema for the structuredContent object
const StructuredContentSchema = z.object({
  name: z.string(),
  summary: z.string().optional(),
  contact: z.array(ContactInfoSchema),
  skills: z.array(SkillEntrySchema),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  clients: z.array(ClientEntrySchema).optional(),
  about: z.string().optional()
});

// Schema for the analyzed content
const AnalyzedContentSchema = z.object({
  sections: SectionsSchema,
  structuredContent: StructuredContentSchema
});

/**
 * Process a PDF file
 *
 * @param pdfPath Path to the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the processing results
 */
export async function processPdf(pdfPath: string, forceRefresh: boolean = false): Promise<{
  success: boolean;
  message: string;
  contentFingerprint?: string;
  extractedContent?: any;
  analyzedContent?: any;
  validationResult?: any;
  error?: any;
}> {
  try {
    console.log('Starting PDF processing pipeline');
    HesseLogger.summary.start('Processing PDF content');

    // 1. Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      const error = `PDF file not found at ${pdfPath}`;
      console.error(error);
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
    if (needsRefresh) {
      console.log('Extracting content from PDF');
      HesseLogger.summary.progress('Extracting content from PDF');

      // Run the extraction script
      const extractionStart = Date.now();
      const { stdout, stderr } = await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);
      const extractionTime = Date.now() - extractionStart;

      if (stderr) {
        console.error(`Error extracting content: ${stderr}`);
        return { success: false, message: 'Error extracting content', error: stderr };
      }

      console.log(`Content extracted in ${extractionTime}ms`);
      HesseLogger.summary.progress(`Content extracted in ${extractionTime}ms`);

      // Update the content state to indicate processing is complete
      contentStateService.updateState({
        isProcessed: true
      });
    } else {
      console.log('Using cached content extraction');
      HesseLogger.summary.progress('Using cached content extraction');
    }

    // 8. Read the extracted content
    const jsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');

    if (!fs.existsSync(jsonPath)) {
      const error = 'Extracted content not found';
      console.error(error);
      return { success: false, message: error };
    }

    const extractedContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 9. Analyze the content with ChatGPT if needed
    let analyzedContent;
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

    if (needsRefresh || !fs.existsSync(analyzedPath) || !contentStateService.isContentAnalyzed()) {
      console.log('Analyzing content with ChatGPT');
      HesseLogger.ai.start('Analyzing content with ChatGPT');

      const rawText = extractedContent.rawText;
      const analysisStart = Date.now();
      analyzedContent = await analyzeResumeContent(rawText);
      const analysisTime = Date.now() - analysisStart;

      console.log(`Content analyzed in ${analysisTime}ms`);
      HesseLogger.ai.success(`Content analyzed in ${analysisTime}ms`);

      // Save the analyzed content
      fs.writeFileSync(analyzedPath, JSON.stringify(analyzedContent, null, 2));

      // Update the content state to indicate analysis is complete
      contentStateService.updateState({
        isAnalyzed: true
      });
    } else {
      console.log('Using cached content analysis');
      HesseLogger.summary.progress('Using cached content analysis');

      // Read the cached analyzed content
      analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
    }

    // 10. Validate the analyzed content
    console.log('Validating analyzed content');
    HesseLogger.summary.progress('Validating analyzed content');

    const validationResult = AnalyzedContentSchema.safeParse(analyzedContent);

    if (!validationResult.success) {
      console.error('Content validation failed');
      HesseLogger.summary.error('Content validation failed');

      // Format the validation errors
      const formattedErrors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      // Update the content state to indicate analysis failed
      contentStateService.updateState({
        isAnalyzed: false
      });

      return {
        success: false,
        message: 'Content validation failed',
        contentFingerprint,
        extractedContent,
        analyzedContent,
        validationResult: {
          success: false,
          errors: formattedErrors
        }
      };
    }

    console.log('Content validation successful');
    HesseLogger.summary.progress('Content validation successful');

    // 11. Update the build info
    const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');
    const buildInfo = {
      buildTimestamp: new Date().toISOString(),
      pdfInfo: {
        path: pdfPath,
        size: pdfSize,
        lastModified: pdfModified.toISOString(),
        contentFingerprint
      },
      extractionStatus: {
        textExtracted: true,
        markdownExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'resume_content.md')),
        fontsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'font_info.json')),
        colorsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'color_theme.json')),
        chatGptAnalyzed: true
      },
      contentState: contentStateService.getState()
    };

    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

    // 12. Return the results
    console.log('PDF processing pipeline completed successfully');
    HesseLogger.summary.complete('PDF processing completed successfully');

    return {
      success: true,
      message: 'PDF processed successfully',
      contentFingerprint,
      extractedContent,
      analyzedContent,
      validationResult: {
        success: true
      }
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    HesseLogger.summary.error(`Error processing PDF: ${error}`);

    return {
      success: false,
      message: 'Error processing PDF',
      error
    };
  }
}

/**
 * Get the analyzed content
 *
 * @param forceRefresh Whether to force a refresh of the content
 * @returns The analyzed content
 */
export async function getAnalyzedContent(forceRefresh: boolean = false): Promise<any> {
  try {
    HesseLogger.summary.start('Getting analyzed content');

    // Path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Get the content state service
    const contentStateService = ContentStateService.getInstance();

    // Check if we need to refresh the content
    if (!forceRefresh) {
      // Check if the content is stale by comparing fingerprints
      const pdfBuffer = fs.readFileSync(pdfPath);
      const currentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);
      const storedFingerprint = contentStateService.getFingerprint();

      if (currentFingerprint !== storedFingerprint) {
        console.log(`Content is stale: fingerprint changed`);
        forceRefresh = true;
      }
    }

    // Process the PDF
    const result = await processPdf(pdfPath, forceRefresh);

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log('Analyzed content retrieved successfully');
    HesseLogger.summary.complete('Analyzed content retrieved successfully');

    return result.analyzedContent;
  } catch (error) {
    console.error('Error getting analyzed content:', error);
    HesseLogger.summary.error(`Error getting analyzed content: ${error}`);
    throw error;
  }
}

/**
 * Check if the analyzed content is valid
 *
 * @returns Object containing the validation result
 */
export async function validateAnalyzedContent(): Promise<{
  valid: boolean;
  errors?: any[];
  contentState?: any;
}> {
  try {
    HesseLogger.summary.start('Validating analyzed content');

    // Get the content state service
    const contentStateService = ContentStateService.getInstance();
    const contentState = contentStateService.getState();

    // Check if the content has been analyzed
    if (!contentState.isAnalyzed) {
      console.warn('Content has not been analyzed yet');
      return {
        valid: false,
        contentState,
        errors: [{
          path: 'contentState',
          message: 'Content has not been analyzed yet',
          code: 'not_analyzed'
        }]
      };
    }

    // Path to the analyzed content
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

    // Check if the file exists
    if (!fs.existsSync(analyzedPath)) {
      console.error('Analyzed content file not found');

      // Update the content state to indicate analysis is missing
      contentStateService.updateState({
        isAnalyzed: false
      });

      return {
        valid: false,
        contentState,
        errors: [{
          path: 'file',
          message: 'Analyzed content file not found',
          code: 'not_found'
        }]
      };
    }

    // Read the analyzed content
    const analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));

    // Validate the content
    const validationResult = AnalyzedContentSchema.safeParse(analyzedContent);

    if (!validationResult.success) {
      console.error('Content validation failed');

      // Format the validation errors
      const formattedErrors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      // Update the content state to indicate validation failed
      contentStateService.updateState({
        isAnalyzed: false
      });

      return {
        valid: false,
        contentState,
        errors: formattedErrors
      };
    }

    console.log('Content validation successful');
    HesseLogger.summary.complete('Content validation successful');

    return {
      valid: true,
      contentState
    };
  } catch (error) {
    console.error('Error validating analyzed content:', error);
    HesseLogger.summary.error(`Error validating analyzed content: ${error}`);

    return {
      valid: false,
      errors: [{
        path: 'system',
        message: error instanceof Error ? error.message : String(error),
        code: 'system_error'
      }]
    };
  }
}

export default {
  processPdf,
  getAnalyzedContent,
  validateAnalyzedContent
};
