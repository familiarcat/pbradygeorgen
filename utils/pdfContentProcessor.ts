/**
 * PDF Content Processor
 *
 * This service handles the entire PDF processing pipeline:
 * 1. Extracts content from PDF
 * 2. Analyzes content with ChatGPT
 * 3. Validates the analyzed content against Zod schemas
 * 4. Saves the analyzed content for use in SSR
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { z } from 'zod';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { analyzeResumeContent } from './openaiPdfStructureService';

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
    DanteLogger.success.core('Starting PDF processing pipeline');
    HesseLogger.summary.start('Processing PDF content');

    // 1. Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      const error = `PDF file not found at ${pdfPath}`;
      DanteLogger.error.dataFlow(error);
      return { success: false, message: error };
    }

    // 2. Get PDF metadata
    const stats = fs.statSync(pdfPath);
    const pdfSize = stats.size;
    const pdfModified = stats.mtime.getTime();
    const pdfModifiedDate = new Date(pdfModified).toISOString();

    // 3. Generate content fingerprint
    const contentFingerprint = crypto
      .createHash('sha256')
      .update(`${pdfPath}:${pdfSize}:${pdfModified}`)
      .digest('hex');

    // 4. Check if we need to refresh the content
    const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');
    let needsRefresh = forceRefresh;

    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));

      // Check if the fingerprint has changed
      if (buildInfo.pdfInfo?.contentFingerprint !== contentFingerprint) {
        DanteLogger.success.basic('PDF content has changed, refreshing');
        needsRefresh = true;
      }
    } else {
      // If build info doesn't exist, we need to refresh
      DanteLogger.success.basic('Build info not found, refreshing content');
      needsRefresh = true;
    }

    // 5. Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // 6. Extract content from the PDF if needed
    if (needsRefresh) {
      DanteLogger.success.basic('Extracting content from PDF');
      HesseLogger.summary.progress('Extracting content from PDF');

      // Run the extraction script
      const extractionStart = Date.now();
      const { stdout, stderr } = await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);
      const extractionTime = Date.now() - extractionStart;

      if (stderr) {
        DanteLogger.error.dataFlow(`Error extracting content: ${stderr}`);
        return { success: false, message: 'Error extracting content', error: stderr };
      }

      DanteLogger.success.core(`Content extracted in ${extractionTime}ms`);
      HesseLogger.summary.progress(`Content extracted in ${extractionTime}ms`);
    } else {
      DanteLogger.success.basic('Using cached content extraction');
      HesseLogger.summary.progress('Using cached content extraction');
    }

    // 7. Read the extracted content
    const jsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');

    if (!fs.existsSync(jsonPath)) {
      const error = 'Extracted content not found';
      DanteLogger.error.dataFlow(error);
      return { success: false, message: error };
    }

    const extractedContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 8. Analyze the content with ChatGPT
    DanteLogger.success.basic('Analyzing content with ChatGPT');
    HesseLogger.ai.start('Analyzing content with ChatGPT');

    const rawText = extractedContent.rawText;
    const analysisStart = Date.now();
    const analyzedContent = await analyzeResumeContent(rawText);
    const analysisTime = Date.now() - analysisStart;

    DanteLogger.success.core(`Content analyzed in ${analysisTime}ms`);
    HesseLogger.ai.success(`Content analyzed in ${analysisTime}ms`);

    // 9. Validate the analyzed content
    DanteLogger.success.basic('Validating analyzed content');
    HesseLogger.summary.progress('Validating analyzed content');

    const validationResult = AnalyzedContentSchema.safeParse(analyzedContent);

    if (!validationResult.success) {
      DanteLogger.error.dataFlow('Content validation failed');
      HesseLogger.summary.error('Content validation failed');

      // Format the validation errors
      const formattedErrors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

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

    DanteLogger.success.core('Content validation successful');
    HesseLogger.summary.progress('Content validation successful');

    // 10. Save the analyzed content
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    fs.writeFileSync(analyzedPath, JSON.stringify(analyzedContent, null, 2));

    // 11. Update the build info
    const buildInfo = {
      buildTimestamp: new Date().toISOString(),
      pdfInfo: {
        path: pdfPath,
        size: pdfSize,
        lastModified: pdfModifiedDate,
        contentFingerprint
      },
      extractionStatus: {
        textExtracted: true,
        markdownExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'resume_content.md')),
        fontsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'font_info.json')),
        colorsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'color_theme.json')),
        chatGptAnalyzed: true
      }
    };

    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

    // 12. Return the results
    DanteLogger.success.perfection('PDF processing pipeline completed successfully');
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
    DanteLogger.error.system('Error processing PDF', error);
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
    // Path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Process the PDF
    const result = await processPdf(pdfPath, forceRefresh);

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.analyzedContent;
  } catch (error) {
    DanteLogger.error.system('Error getting analyzed content', error);
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
}> {
  try {
    // Path to the analyzed content
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

    // Check if the file exists
    if (!fs.existsSync(analyzedPath)) {
      return {
        valid: false,
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
      // Format the validation errors
      const formattedErrors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      return {
        valid: false,
        errors: formattedErrors
      };
    }

    return {
      valid: true
    };
  } catch (error) {
    DanteLogger.error.system('Error validating analyzed content', error);

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
