/**
 * CSS Variable Extractor
 *
 * A utility for extracting CSS variables from the document with robust fallback mechanisms.
 * This follows the Derrida philosophy of deconstructing hardcoded implementations and
 * the Hesse philosophy of mathematical harmony in implementation patterns.
 */

import { DanteLogger } from './DanteLogger';

/**
 * Interface for CSS variable extraction options
 */
export interface CssVariableOptions {
  /**
   * Whether to log detailed information about the extraction process
   */
  verbose?: boolean;

  /**
   * Whether to use the Dante logger for logging
   */
  useDanteLogger?: boolean;

  /**
   * Whether to throw errors when variables are not found
   */
  throwOnMissing?: boolean;
}

/**
 * Extract a CSS variable from the document with fallbacks
 *
 * @param variableName The name of the CSS variable to extract (without the -- prefix)
 * @param fallbacks Array of fallback variable names to try if the primary one is not found
 * @param defaultValue Default value to use if all variables are not found
 * @param options Options for the extraction process
 * @returns The value of the CSS variable or the default value
 */
export function extractCssVariable(
  variableName: string,
  fallbacks: string[] = [],
  defaultValue: string = '',
  options: CssVariableOptions = {}
): string {
  const { verbose = false, useDanteLogger = true, throwOnMissing = false } = options;

  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (verbose && useDanteLogger) {
      DanteLogger.warn.deprecated('CSS variable extraction attempted in non-browser environment');
    } else if (verbose) {
      console.warn('CSS variable extraction attempted in non-browser environment');
    }
    return defaultValue;
  }

  try {
    // Get computed style from document root
    const computedStyle = getComputedStyle(document.documentElement);

    // Try the primary variable first
    const primaryVar = `--${variableName}`;
    let value = computedStyle.getPropertyValue(primaryVar).trim();

    // If primary variable is found, return it
    if (value) {
      if (verbose && useDanteLogger) {
        DanteLogger.success.basic(`Found CSS variable ${primaryVar}: ${value}`);
      } else if (verbose) {
        console.log(`Found CSS variable ${primaryVar}: ${value}`);
      }
      return value;
    }

    // Try fallbacks in order
    for (const fallback of fallbacks) {
      const fallbackVar = `--${fallback}`;
      value = computedStyle.getPropertyValue(fallbackVar).trim();
      
      if (value) {
        if (verbose && useDanteLogger) {
          DanteLogger.success.basic(`Using fallback CSS variable ${fallbackVar}: ${value}`);
        } else if (verbose) {
          console.log(`Using fallback CSS variable ${fallbackVar}: ${value}`);
        }
        return value;
      }
    }

    // If no variables found, use default value
    if (verbose && useDanteLogger) {
      DanteLogger.warn.deprecated(`CSS variable ${primaryVar} and fallbacks not found, using default: ${defaultValue}`);
    } else if (verbose) {
      console.warn(`CSS variable ${primaryVar} and fallbacks not found, using default: ${defaultValue}`);
    }

    // Throw error if configured to do so
    if (throwOnMissing) {
      throw new Error(`CSS variable ${primaryVar} and fallbacks not found`);
    }

    return defaultValue;
  } catch (error) {
    if (useDanteLogger) {
      DanteLogger.error.runtime(`Error extracting CSS variable ${variableName}: ${error}`);
    } else {
      console.error(`Error extracting CSS variable ${variableName}:`, error);
    }

    // Re-throw if configured to do so
    if (throwOnMissing) {
      throw error;
    }

    return defaultValue;
  }
}

/**
 * Extract PDF style variables for DOCX generation
 *
 * @param options Options for the extraction process
 * @returns Object containing extracted style variables
 */
export function extractPdfStyleVariables(options: CssVariableOptions = {}): {
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
} {
  const { verbose = false } = options;

  if (verbose) {
    if (options.useDanteLogger) {
      DanteLogger.success.basic('Extracting PDF style variables for DOCX generation');
    } else {
      console.log('Extracting PDF style variables for DOCX generation');
    }
  }

  // Extract font variables
  const headingFont = extractCssVariable(
    'dynamic-heading-font',
    ['pdf-heading-font', 'font-heading', 'theme-font-heading'],
    'sans-serif',
    options
  );

  const bodyFont = extractCssVariable(
    'dynamic-primary-font',
    ['pdf-body-font', 'font-body', 'theme-font-body'],
    'serif',
    options
  );

  // Extract color variables
  const primaryColor = extractCssVariable(
    'dynamic-primary',
    ['pdf-primary-color', 'primary-color', 'theme-color-primary'],
    '#00A99D',
    options
  );

  const secondaryColor = extractCssVariable(
    'dynamic-secondary',
    ['pdf-secondary-color', 'secondary-color', 'theme-color-secondary'],
    '#333333',
    options
  );

  const textColor = extractCssVariable(
    'dynamic-text',
    ['pdf-text-color', 'text-color', 'theme-color-text'],
    '#333333',
    options
  );

  const accentColor = extractCssVariable(
    'dynamic-accent',
    ['pdf-accent-color', 'accent-color', 'theme-color-accent'],
    '#FF5722',
    options
  );

  const backgroundColor = extractCssVariable(
    'dynamic-background',
    ['pdf-background-color', 'background-color', 'theme-color-background'],
    '#FFFFFF',
    options
  );

  const borderColor = extractCssVariable(
    'dynamic-border',
    ['pdf-border-color', 'border-color', 'theme-color-border'],
    '#DDDDDD',
    options
  );

  return {
    headingFont,
    bodyFont,
    primaryColor,
    secondaryColor,
    textColor,
    accentColor,
    backgroundColor,
    borderColor
  };
}

export default {
  extractCssVariable,
  extractPdfStyleVariables
};
