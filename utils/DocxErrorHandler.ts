/**
 * DOCX Error Handler
 *
 * A utility for handling errors in DOCX generation and download.
 * This follows the Dante philosophy of methodical error handling and
 * the Result pattern for explicit error handling.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { Result } from './result';

/**
 * Types of DOCX errors
 */
export enum DocxErrorType {
  GENERATION = 'generation',
  DOWNLOAD = 'download',
  STYLE_EXTRACTION = 'style_extraction',
  API_ERROR = 'api_error',
  NETWORK_ERROR = 'network_error',
  BROWSER_COMPATIBILITY = 'browser_compatibility',
  UNKNOWN = 'unknown'
}

/**
 * Interface for DOCX error details
 */
export interface DocxErrorDetails {
  type: DocxErrorType;
  message: string;
  originalError?: Error | unknown;
  fileName?: string;
  documentType?: 'resume' | 'introduction' | string;
  context?: Record<string, any>;
}

/**
 * Create a detailed error message from error details
 */
function createDetailedErrorMessage(details: DocxErrorDetails): string {
  const { type, message, fileName, documentType } = details;
  
  let detailedMessage = `DOCX ${type} error: ${message}`;
  
  if (fileName) {
    detailedMessage += ` | File: ${fileName}`;
  }
  
  if (documentType) {
    detailedMessage += ` | Type: ${documentType}`;
  }
  
  return detailedMessage;
}

/**
 * Log a DOCX error with appropriate logging levels
 */
export function logDocxError(details: DocxErrorDetails): void {
  const { type, originalError, context } = details;
  const detailedMessage = createDetailedErrorMessage(details);
  
  // Log with Dante logger
  switch (type) {
    case DocxErrorType.GENERATION:
      DanteLogger.error.runtime(detailedMessage, { originalError, context });
      break;
    case DocxErrorType.DOWNLOAD:
      DanteLogger.error.dataFlow(detailedMessage, { originalError, context });
      break;
    case DocxErrorType.STYLE_EXTRACTION:
      DanteLogger.error.config(detailedMessage, { originalError, context });
      break;
    case DocxErrorType.API_ERROR:
      DanteLogger.error.resources(detailedMessage, { originalError, context });
      break;
    case DocxErrorType.NETWORK_ERROR:
      DanteLogger.error.dataFlow(detailedMessage, { originalError, context });
      break;
    case DocxErrorType.BROWSER_COMPATIBILITY:
      DanteLogger.error.config(detailedMessage, { originalError, context });
      break;
    default:
      DanteLogger.error.runtime(detailedMessage, { originalError, context });
  }
  
  // Log with Hesse logger
  HesseLogger.summary.error(`DOCX error: ${detailedMessage}`);
  
  // Log to console for debugging
  console.error(`[DocxErrorHandler] ${detailedMessage}`, { originalError, context });
}

/**
 * Create a Result object from a DOCX error
 */
export function createDocxErrorResult<T>(details: DocxErrorDetails): Result<T> {
  logDocxError(details);
  return Result.failure<T>(createDetailedErrorMessage(details));
}

/**
 * Handle a DOCX error and return a user-friendly message
 */
export function handleDocxError(
  details: DocxErrorDetails,
  onError?: (error: Error) => void
): string {
  logDocxError(details);
  
  // Create an Error object
  const error = new Error(createDetailedErrorMessage(details));
  
  // Call the error handler if provided
  if (onError) {
    onError(error);
  }
  
  // Return a user-friendly message based on the error type
  switch (details.type) {
    case DocxErrorType.GENERATION:
      return 'There was an error generating the Word document. Please try again.';
    case DocxErrorType.DOWNLOAD:
      return 'There was an error downloading the Word document. Please try again.';
    case DocxErrorType.STYLE_EXTRACTION:
      return 'There was an error applying styles to the Word document. The document will use default styling.';
    case DocxErrorType.API_ERROR:
      return 'There was an error communicating with the server. Please try again later.';
    case DocxErrorType.NETWORK_ERROR:
      return 'Network error. Please check your internet connection and try again.';
    case DocxErrorType.BROWSER_COMPATIBILITY:
      return 'Your browser may not fully support Word document downloads. Please try using a different browser.';
    default:
      return 'There was an unexpected error. Please try again.';
  }
}

/**
 * Determine the error type from an error object
 */
export function determineErrorType(error: Error | unknown): DocxErrorType {
  if (!error) {
    return DocxErrorType.UNKNOWN;
  }
  
  const errorString = String(error).toLowerCase();
  
  if (errorString.includes('network') || errorString.includes('fetch') || errorString.includes('connection')) {
    return DocxErrorType.NETWORK_ERROR;
  }
  
  if (errorString.includes('api') || errorString.includes('server') || errorString.includes('status')) {
    return DocxErrorType.API_ERROR;
  }
  
  if (errorString.includes('style') || errorString.includes('css') || errorString.includes('variable')) {
    return DocxErrorType.STYLE_EXTRACTION;
  }
  
  if (errorString.includes('download') || errorString.includes('blob') || errorString.includes('url')) {
    return DocxErrorType.DOWNLOAD;
  }
  
  if (errorString.includes('generate') || errorString.includes('create') || errorString.includes('pandoc')) {
    return DocxErrorType.GENERATION;
  }
  
  if (errorString.includes('browser') || errorString.includes('compatibility') || errorString.includes('support')) {
    return DocxErrorType.BROWSER_COMPATIBILITY;
  }
  
  return DocxErrorType.UNKNOWN;
}

export default {
  logDocxError,
  createDocxErrorResult,
  handleDocxError,
  determineErrorType,
  DocxErrorType
};
