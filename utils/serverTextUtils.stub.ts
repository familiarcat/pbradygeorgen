/**
 * Simplified serverTextUtils for AWS Amplify build
 */

/**
 * Extracts text content from a PDF file
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  return "This is a simplified version of the extractTextFromPdf function for AWS Amplify build.";
}

/**
 * Converts text to markdown format
 */
export function convertToMarkdown(text: string): string {
  return `# Converted to Markdown\n\n${text}`;
}

/**
 * Extracts key information from text
 */
export function extractKeyInfo(text: string): Record<string, any> {
  return {
    title: "Sample Title",
    content: text,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Sanitizes text for safe display
 */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Formats text for display
 */
export function formatText(text: string, options?: { trim?: boolean; maxLength?: number }): string {
  let result = text;
  
  if (options?.trim) {
    result = result.trim();
  }
  
  if (options?.maxLength && result.length > options.maxLength) {
    result = result.substring(0, options.maxLength) + '...';
  }
  
  return result;
}
