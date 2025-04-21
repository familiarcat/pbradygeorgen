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
