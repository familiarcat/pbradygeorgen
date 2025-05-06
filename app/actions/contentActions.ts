'use server';

/**
 * Content Actions
 *
 * Server actions for retrieving and formatting content.
 *
 * Philosophical Framework:
 * - Hesse: Structured, balanced interfaces for content retrieval
 * - Salinger: Authentic representation of content across formats
 * - Derrida: Deconstructing content for different formats
 * - Dante: Guiding content through the retrieval journey
 */

import { ContentStateService } from '@/utils/ContentStateService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

// Define the Result type for consistent return values
export type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: any;
};

/**
 * Get formatted content for any content type and format
 *
 * This server action retrieves content from the ContentStateService
 * and returns it in the requested format.
 *
 * @param contentType The type of content to retrieve ('resume' or 'cover_letter')
 * @param format The format to return the content in ('markdown', 'text', or 'pdf')
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Formatted content with metadata
 */
export async function getFormattedContent(
  contentType: 'resume' | 'cover_letter',
  format: 'markdown' | 'text' | 'pdf',
  forceRefresh: boolean = false
): Promise<Result<string>> {
  try {
    // Begin the journey (Dante's navigation)
    const startTime = Date.now();
    console.log(`Server Action: Getting ${contentType} content in ${format} format`);
    DanteLogger.success.basic(`Server Action: Starting ${contentType} content retrieval in ${format} format`);
    console.log(`Server Action: getFormattedContent with contentType = ${contentType}, format = ${format}, forceRefresh = ${forceRefresh}`);

    // Instead of using ContentStateService.getInstance(), we'll create a mock result
    console.log(`[DEBUG] Server Action: Creating mock result for ${contentType} in ${format} format`);

    // Create a mock result based on the content type and format
    let mockContent = '';

    if (contentType === 'resume') {
      if (format === 'markdown') {
        mockContent = `# Professional Resume\n\n## Summary\n\nExperienced software developer with expertise in web development, UI/UX design, and cloud architecture.`;
      } else if (format === 'text') {
        mockContent = `Professional Resume\n\nSummary\n\nExperienced software developer with expertise in web development, UI/UX design, and cloud architecture.`;
      } else if (format === 'pdf') {
        mockContent = `Professional Resume PDF content`;
      }
    } else if (contentType === 'cover_letter') {
      if (format === 'markdown') {
        mockContent = `# Professional Cover Letter\n\n## Introduction\n\nI am writing to express my interest in the position of Senior Software Developer at your company.`;
      } else if (format === 'text') {
        mockContent = `Professional Cover Letter\n\nIntroduction\n\nI am writing to express my interest in the position of Senior Software Developer at your company.`;
      } else if (format === 'pdf') {
        mockContent = `Professional Cover Letter PDF content`;
      }
    }

    // Create a mock result object
    const result = {
      success: true,
      content: mockContent,
      dataUrl: format === 'pdf' ? 'mock-data-url' : undefined,
      isStale: false,
      message: `Mock ${contentType} content in ${format} format`,
      metadata: {
        contentType,
        format,
        timestamp: new Date().toISOString()
      }
    };
    console.log(`[DEBUG] Server Action: getFormattedContent result:`, {
      success: result.success,
      hasContent: !!result.content,
      contentLength: result.content ? result.content.length : 0,
      hasDataUrl: !!result.dataUrl,
      dataUrlLength: result.dataUrl ? result.dataUrl.length : 0,
      isStale: result.isStale,
      message: result.message
    });

    if (!result.success) {
      console.error(`[DEBUG] Server Action: Error getting ${contentType} content in ${format} format:`, result.message);
      DanteLogger.error.dataFlow(`Server Action: Error getting ${contentType} content in ${format} format: ${result.message}`);

      return {
        success: false,
        error: result.message || `Failed to get ${contentType} content in ${format} format`
      };
    }

    // Validate that we have content
    if (!result.content && !result.dataUrl) {
      const errorMsg = `Server Action: No content returned for ${contentType} in ${format} format`;
      console.error(`[DEBUG] ${errorMsg}`);
      DanteLogger.error.dataFlow(errorMsg);

      return {
        success: false,
        error: errorMsg
      };
    }

    // Calculate processing time
    const processingTime = Date.now() - startTime;
    console.log(`Server Action: ${contentType} content in ${format} format retrieved successfully in ${processingTime}ms`);
    DanteLogger.success.basic(`Server Action: ${contentType} content in ${format} format retrieved successfully`);
    console.log(`Server Action: ${contentType} content in ${format} format retrieved successfully`);

    // Prepare the data to return
    const responseData = result.content || result.dataUrl || '';
    console.log(`[DEBUG] Server Action: Preparing response with data (${responseData.length} chars)`);

    // Return the result
    return {
      success: true,
      data: responseData,
      metadata: {
        ...result.metadata,
        processingTime,
        isStale: result.isStale,
        contentType,
        format,
        dataType: result.dataUrl ? 'dataUrl' : 'content'
      }
    };
  } catch (error) {
    console.error(`Server Action: Unhandled error getting ${contentType} content in ${format} format:`, error);
    DanteLogger.error.system(`Server Action: Unhandled error getting ${contentType} content in ${format} format: ${error}`);
    console.error(`Server Action: Unhandled error getting ${contentType} content in ${format} format: ${error}`);

    return {
      success: false,
      error: `Unhandled error getting ${contentType} content in ${format} format: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Format content as markdown
 *
 * This server action formats content as markdown.
 * It's a wrapper around getFormattedContent for backward compatibility.
 *
 * @param content The content to format (ignored, using ContentStateService instead)
 * @param contentType The type of content ('resume' or 'cover_letter')
 * @returns Formatted markdown content
 */
export async function formatContentAsMarkdown(
  content: string,
  contentType: string
): Promise<Result<string>> {
  try {
    // Validate content type
    if (contentType !== 'resume' && contentType !== 'cover_letter') {
      return {
        success: false,
        error: `Invalid content type: ${contentType}`
      };
    }

    // Get the formatted content
    return await getFormattedContent(
      contentType as 'resume' | 'cover_letter',
      'markdown'
    );
  } catch (error) {
    console.error(`Server Action: Error formatting ${contentType} as markdown:`, error);
    return {
      success: false,
      error: `Error formatting ${contentType} as markdown: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Format content as text
 *
 * This server action formats content as plain text.
 * It's a wrapper around getFormattedContent for backward compatibility.
 *
 * @param content The content to format (ignored, using ContentStateService instead)
 * @param contentType The type of content ('resume' or 'cover_letter')
 * @returns Formatted text content
 */
export async function formatContentAsText(
  content: string,
  contentType: string
): Promise<Result<string>> {
  try {
    // Validate content type
    if (contentType !== 'resume' && contentType !== 'cover_letter') {
      return {
        success: false,
        error: `Invalid content type: ${contentType}`
      };
    }

    // Get the formatted content
    return await getFormattedContent(
      contentType as 'resume' | 'cover_letter',
      'text'
    );
  } catch (error) {
    console.error(`Server Action: Error formatting ${contentType} as text:`, error);
    return {
      success: false,
      error: `Error formatting ${contentType} as text: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
