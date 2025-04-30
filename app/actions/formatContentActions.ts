/**
 * Format Content Actions
 * 
 * Server actions for formatting content with OpenAI.
 * These actions can be called directly from client components.
 */

'use server'

import { getFormattedContent } from '@/app/components/server/ContentFormatter';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * Format content as markdown
 */
export async function formatContentAsMarkdown(
  content: string,
  contentType: string
): Promise<{
  success: boolean;
  data: string;
  error?: string;
}> {
  try {
    HesseLogger.summary.start('Formatting content as markdown');
    const result = await getFormattedContent(content, contentType, 'markdown');
    HesseLogger.summary.complete('Content formatted as markdown');
    return result;
  } catch (error) {
    HesseLogger.summary.error(`Error formatting content as markdown: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      data: content,
      error: `Error formatting content as markdown: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Format content as text
 */
export async function formatContentAsText(
  content: string,
  contentType: string
): Promise<{
  success: boolean;
  data: string;
  error?: string;
}> {
  try {
    HesseLogger.summary.start('Formatting content as text');
    const result = await getFormattedContent(content, contentType, 'text');
    HesseLogger.summary.complete('Content formatted as text');
    return result;
  } catch (error) {
    HesseLogger.summary.error(`Error formatting content as text: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      data: content,
      error: `Error formatting content as text: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
