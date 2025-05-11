'use client';

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { PhilosophicalLogger } from './PhilosophicalLogger';
import { Result, ok, err } from './Result';

/**
 * OpenAI Error Handler
 * 
 * A utility for handling OpenAI API errors in a consistent way across the application.
 * Follows the philosophical frameworks of Hesse, Salinger, Derrida, and Dante.
 */

/**
 * OpenAI Error Types
 */
export enum OpenAIErrorType {
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  RATE_LIMIT = 'rate_limit',
  QUOTA = 'quota',
  SERVER = 'server',
  MODEL = 'model',
  VALIDATION = 'validation',
  CONNECTION = 'connection',
  TIMEOUT = 'timeout',
  PARSE = 'parse',
  UNKNOWN = 'unknown'
}

/**
 * OpenAI Error Response
 */
export interface OpenAIErrorResponse {
  error?: {
    message?: string;
    type?: string;
    param?: string;
    code?: string;
  };
}

/**
 * Handle OpenAI API errors
 * 
 * @param error The error object
 * @param context Additional context for the error
 * @returns A Result with the error
 */
export function handleOpenAIError(error: any, context: string = 'OpenAI API'): Result<never, Error> {
  // Safely convert error to string to avoid "Cannot read properties of undefined" errors
  const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');
  
  // Log the error with all available loggers for redundancy
  try {
    HesseLogger.ai.error(`Error in ${context}: ${errorMessage}`);
  } catch (logError) {
    // Silent catch
  }
  
  try {
    DanteLogger.error.runtime(`Error in ${context}: ${errorMessage}`);
  } catch (logError) {
    // Silent catch
  }
  
  // Always log to console as a fallback
  console.error(`Error in ${context}: ${errorMessage}`, error || 'Unknown error');
  
  // Use PhilosophicalLogger for more robust logging
  PhilosophicalLogger.ai.error(`Error in ${context}: ${errorMessage}`);
  
  // Determine the error type
  const errorType = determineErrorType(error);
  
  // Create a more specific error message based on the error type
  const enhancedErrorMessage = createEnhancedErrorMessage(errorType, errorMessage, context);
  
  // Return a Result with the error
  return err(new Error(enhancedErrorMessage));
}

/**
 * Determine the type of OpenAI error
 * 
 * @param error The error object
 * @returns The error type
 */
function determineErrorType(error: any): OpenAIErrorType {
  // Check if it's a fetch response error
  if (error && error.status) {
    switch (error.status) {
      case 401:
        return OpenAIErrorType.AUTHENTICATION;
      case 403:
        return OpenAIErrorType.PERMISSION;
      case 429:
        return OpenAIErrorType.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
      case 504:
        return OpenAIErrorType.SERVER;
      case 400:
        // Check if it's a model error
        if (error.data && error.data.error && error.data.error.message) {
          if (error.data.error.message.includes('model')) {
            return OpenAIErrorType.MODEL;
          }
          if (error.data.error.message.includes('quota')) {
            return OpenAIErrorType.QUOTA;
          }
        }
        return OpenAIErrorType.VALIDATION;
    }
  }
  
  // Check error message for clues
  const errorMessage = String(error || '').toLowerCase();
  
  if (errorMessage.includes('api key')) {
    return OpenAIErrorType.AUTHENTICATION;
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('access')) {
    return OpenAIErrorType.PERMISSION;
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return OpenAIErrorType.RATE_LIMIT;
  }
  
  if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
    return OpenAIErrorType.QUOTA;
  }
  
  if (errorMessage.includes('model')) {
    return OpenAIErrorType.MODEL;
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return OpenAIErrorType.TIMEOUT;
  }
  
  if (errorMessage.includes('parse') || errorMessage.includes('json')) {
    return OpenAIErrorType.PARSE;
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('fetch')) {
    return OpenAIErrorType.CONNECTION;
  }
  
  return OpenAIErrorType.UNKNOWN;
}

/**
 * Create an enhanced error message based on the error type
 * 
 * @param errorType The type of error
 * @param originalMessage The original error message
 * @param context Additional context for the error
 * @returns An enhanced error message
 */
function createEnhancedErrorMessage(errorType: OpenAIErrorType, originalMessage: string, context: string): string {
  switch (errorType) {
    case OpenAIErrorType.AUTHENTICATION:
      return `Authentication error in ${context}: Please check your OpenAI API key. ${originalMessage}`;
    
    case OpenAIErrorType.PERMISSION:
      return `Permission error in ${context}: Your API key doesn't have access to this resource. ${originalMessage}`;
    
    case OpenAIErrorType.RATE_LIMIT:
      return `Rate limit exceeded in ${context}: Please try again later. ${originalMessage}`;
    
    case OpenAIErrorType.QUOTA:
      return `Quota exceeded in ${context}: Please check your OpenAI billing status. ${originalMessage}`;
    
    case OpenAIErrorType.SERVER:
      return `OpenAI server error in ${context}: Please try again later. ${originalMessage}`;
    
    case OpenAIErrorType.MODEL:
      return `Model error in ${context}: The requested model may not be available or supported. ${originalMessage}`;
    
    case OpenAIErrorType.VALIDATION:
      return `Validation error in ${context}: The request was invalid. ${originalMessage}`;
    
    case OpenAIErrorType.CONNECTION:
      return `Connection error in ${context}: Could not connect to OpenAI API. ${originalMessage}`;
    
    case OpenAIErrorType.TIMEOUT:
      return `Timeout error in ${context}: The request took too long to complete. ${originalMessage}`;
    
    case OpenAIErrorType.PARSE:
      return `Parse error in ${context}: Could not parse the OpenAI response. ${originalMessage}`;
    
    case OpenAIErrorType.UNKNOWN:
    default:
      return `Unknown error in ${context}: ${originalMessage}`;
  }
}

export default {
  handleOpenAIError,
  OpenAIErrorType
};
