'use server';

import { processPdf, getAnalyzedContent, validateAnalyzedContent } from '@/utils/pdfContentProcessor';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * Process the default PDF file
 * 
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the processing results
 */
export async function processDefaultPdf(forceRefresh: boolean = false) {
  try {
    // Path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    
    // Process the PDF
    const result = await processPdf(pdfPath, forceRefresh);
    
    return result;
  } catch (error) {
    DanteLogger.error.system('Error processing default PDF', error);
    
    return {
      success: false,
      message: 'Error processing default PDF',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get the analyzed content
 * 
 * @param forceRefresh Whether to force a refresh of the content
 * @returns The analyzed content
 */
export async function getAnalyzedPdfContent(forceRefresh: boolean = false) {
  try {
    // Get the analyzed content
    const analyzedContent = await getAnalyzedContent(forceRefresh);
    
    return {
      success: true,
      data: analyzedContent
    };
  } catch (error) {
    DanteLogger.error.system('Error getting analyzed PDF content', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Validate the analyzed content
 * 
 * @returns Object containing the validation result
 */
export async function validateAnalyzedPdfContent() {
  try {
    // Validate the analyzed content
    const validationResult = await validateAnalyzedContent();
    
    return {
      success: true,
      valid: validationResult.valid,
      errors: validationResult.errors
    };
  } catch (error) {
    DanteLogger.error.system('Error validating analyzed PDF content', error);
    
    return {
      success: false,
      valid: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
