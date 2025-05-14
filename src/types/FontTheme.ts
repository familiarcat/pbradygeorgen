/**
 * FontTheme.ts
 * 
 * Defines the structure of font themes extracted from PDFs.
 * 
 * Philosophical Framework:
 * - Hesse: Mathematical precision in font categorization
 * - Salinger: Intuitive font selection for different purposes
 */

export interface FontTheme {
  heading: string;
  body: string;
  mono: string;
  allFonts: string[];
}

export const defaultFontTheme: FontTheme = {
  heading: "'Arial', sans-serif",
  body: "'Helvetica', Arial, sans-serif",
  mono: "'Courier New', monospace",
  allFonts: ['Arial', 'Helvetica', 'Courier New']
};
