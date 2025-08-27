/**
 * Escapes special characters in text for safe use in React components
 * Server-side compatible version (no 'use client' directive)
 * @param text The text to escape
 * @returns Escaped text safe for React
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

/**
 * Escapes apostrophes in text for safe use in React components
 * @param text The text to escape
 * @returns Text with escaped apostrophes
 */
export function escapeApostrophes(text: string): string {
  return text.replace(/'/g, '&apos;');
}

/**
 * Processes an array of strings to escape apostrophes in each item
 * @param items Array of strings to process
 * @returns Array with escaped apostrophes
 */
export function processTextArray(items: string[]): string[] {
  return items.map(item => escapeApostrophes(item));
}

/**
 * Unescapes HTML entities back to their natural characters for display
 * @param text The text with HTML entities
 * @returns Text with natural characters
 */
export function unescapeHtml(text: string): string {
  return text
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Formats text for natural display by converting HTML entities to natural characters
 * @param text The text to format
 * @returns Formatted text for display
 */
export function formatForDisplay(text: string): string {
  return unescapeHtml(text);
}

/**
 * Formats an array of strings for natural display
 * @param items Array of strings to format
 * @returns Formatted array for display
 */
export function formatArrayForDisplay(items: string[]): string[] {
  return items.map(item => formatForDisplay(item));
}
