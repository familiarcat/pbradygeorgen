'use client';

import { DanteLogger } from '../../../core/logger/dante/DanteLogger';
import * as HesseColorTheoryModule from './HesseColorTheory';
import { ColorTheme, defaultColorTheme } from '../../extraction/SimplePDFColorExtractor';
import { SalingerCtaColors, ComprehensiveColorPalette } from './HesseColorTheory';
import { PhilosophicalLogger } from '../../../core/logger/philosophical/PhilosophicalLogger';

// Handle both default and named exports for HesseColorTheory
const HesseColorTheory = HesseColorTheoryModule.default || HesseColorTheoryModule;

/**
 * Consolidated ColorTheory utility
 *
 * This utility combines all color-related functionality from various sources
 * into a single, easy-to-use interface. It provides methods for:
 *
 * - Generating CTA colors
 * - Creating comprehensive color palettes
 * - Analyzing color contrast
 * - Creating fallback color themes
 *
 * By consolidating these functions, we ensure consistent behavior and avoid
 * import/export issues across the codebase.
 */
export class ColorTheory {
  /**
   * Generate CTA colors using Hesse's mathematical approach
   *
   * @param primaryColor The primary color to base the CTA colors on
   * @returns SalingerCtaColors The generated CTA colors
   */
  static generateCtaColors(primaryColor: string): SalingerCtaColors {
    try {
      // Check if HesseColorTheory is available
      if (!HesseColorTheory) {
        console.warn('HesseColorTheory is undefined, using fallback');

        try {
          PhilosophicalLogger.system.warning('HesseColorTheory is undefined, using fallback');
        } catch (logError) {
          // Silent catch
        }

        // Return a basic CTA color set
        return {
          primary: primaryColor,
          hover: this.adjustBrightness(primaryColor, -10),
          active: this.adjustBrightness(primaryColor, -20),
          disabled: '#cccccc'
        };
      }

      // Use HesseColorTheory to generate CTA colors
      try {
        // Try to use the function directly from the module
        if (typeof HesseColorTheory.generateSalingerCtaColors === 'function') {
          return HesseColorTheory.generateSalingerCtaColors(primaryColor);
        }

        // Fallback to default export if available
        if (HesseColorTheory.default && typeof HesseColorTheory.default.generateSalingerCtaColors === 'function') {
          return HesseColorTheory.default.generateSalingerCtaColors(primaryColor);
        }

        // If neither works, use the fallback
        console.warn('HesseColorTheory methods not found, using fallback');
        return {
          primary: primaryColor,
          hover: this.adjustBrightness(primaryColor, -10),
          active: this.adjustBrightness(primaryColor, -20),
          disabled: '#cccccc'
        };
      } catch (methodError) {
        console.warn('Error calling HesseColorTheory method, using fallback:', methodError);
        return {
          primary: primaryColor,
          hover: this.adjustBrightness(primaryColor, -10),
          active: this.adjustBrightness(primaryColor, -20),
          disabled: '#cccccc'
        };
      }
    } catch (error) {
      console.error('Error generating CTA colors:', error);
      PhilosophicalLogger.error.runtime(`Error generating CTA colors: ${error}`);

      // Return a basic CTA color set as fallback
      return {
        primary: primaryColor,
        hover: this.adjustBrightness(primaryColor, -10),
        active: this.adjustBrightness(primaryColor, -20),
        disabled: '#cccccc'
      };
    }
  }

  /**
   * Generate a comprehensive color palette with light/dark variants
   *
   * @param primaryColor The primary color
   * @param secondaryColor The secondary color
   * @param accentColor The accent color
   * @param backgroundColor The background color
   * @param textColor The text color
   * @param borderColor The border color
   * @param isDark Whether the theme is dark
   * @returns ComprehensiveColorPalette The generated color palette
   */
  static generateColorPalette(
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    backgroundColor: string,
    textColor: string,
    borderColor: string,
    isDark: boolean
  ): ComprehensiveColorPalette {
    try {
      // Create a basic color palette for fallback
      const basicPalette = {
        primary: {
          base: primaryColor,
          light: this.adjustBrightness(primaryColor, 10),
          dark: this.adjustBrightness(primaryColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        secondary: {
          base: secondaryColor,
          light: this.adjustBrightness(secondaryColor, 10),
          dark: this.adjustBrightness(secondaryColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        accent: {
          base: accentColor,
          light: this.adjustBrightness(accentColor, 10),
          dark: this.adjustBrightness(accentColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        ui: {
          modalHeader: isDark ? this.adjustBrightness(primaryColor, -10) : this.adjustBrightness(primaryColor, 40),
          modalBody: isDark ? '#333333' : '#ffffff',
          headerBackground: primaryColor
        }
      };

      // Check if HesseColorTheory is available
      if (!HesseColorTheory) {
        console.warn('HesseColorTheory is undefined, using fallback');

        try {
          PhilosophicalLogger.system.warning('HesseColorTheory is undefined, using fallback');
        } catch (logError) {
          // Silent catch
        }

        return basicPalette;
      }

      // Use HesseColorTheory to generate a comprehensive color palette
      try {
        // Try to use the function directly from the module
        if (typeof HesseColorTheory.generateComprehensiveColorPalette === 'function') {
          return HesseColorTheory.generateComprehensiveColorPalette(
            primaryColor,
            secondaryColor,
            accentColor,
            backgroundColor,
            textColor,
            borderColor,
            isDark
          );
        }

        // Fallback to default export if available
        if (HesseColorTheory.default && typeof HesseColorTheory.default.generateComprehensiveColorPalette === 'function') {
          return HesseColorTheory.default.generateComprehensiveColorPalette(
            primaryColor,
            secondaryColor,
            accentColor,
            backgroundColor,
            textColor,
            borderColor,
            isDark
          );
        }

        // If neither works, use the fallback
        console.warn('HesseColorTheory methods not found, using fallback');
        return basicPalette;
      } catch (methodError) {
        console.warn('Error calling HesseColorTheory method, using fallback:', methodError);
        return basicPalette;
      }
    } catch (error) {
      console.error('Error generating color palette:', error);
      PhilosophicalLogger.error.runtime(`Error generating color palette: ${error}`);

      // Return a basic color palette as fallback
      return {
        primary: {
          base: primaryColor,
          light: this.adjustBrightness(primaryColor, 10),
          dark: this.adjustBrightness(primaryColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        secondary: {
          base: secondaryColor,
          light: this.adjustBrightness(secondaryColor, 10),
          dark: this.adjustBrightness(secondaryColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        accent: {
          base: accentColor,
          light: this.adjustBrightness(accentColor, 10),
          dark: this.adjustBrightness(accentColor, -10),
          contrast: isDark ? '#ffffff' : '#000000'
        },
        ui: {
          modalHeader: isDark ? this.adjustBrightness(primaryColor, -10) : this.adjustBrightness(primaryColor, 40),
          modalBody: isDark ? '#333333' : '#ffffff',
          headerBackground: primaryColor
        }
      };
    }
  }

  /**
   * Create a fallback color theme
   *
   * @param rawColors Array of hex colors extracted from the PDF
   * @returns ColorTheme The fallback color theme
   */
  static createFallbackTheme(rawColors: string[]): ColorTheme {
    try {
      // Use the default color theme as a base
      const fallbackColors = { ...defaultColorTheme, rawColors };

      // Generate CTA colors
      const ctaColors = this.generateCtaColors(fallbackColors.primary);

      // Generate comprehensive color palette
      const comprehensivePalette = this.generateColorPalette(
        fallbackColors.primary,
        fallbackColors.secondary,
        fallbackColors.accent,
        fallbackColors.background,
        fallbackColors.text,
        fallbackColors.border,
        fallbackColors.isDark
      );

      // Return the theme with enhanced color system
      return {
        ...fallbackColors,
        ctaColors,
        palette: comprehensivePalette
      };
    } catch (error) {
      console.error('Error creating fallback theme:', error);
      PhilosophicalLogger.error.runtime(`Error creating fallback theme: ${error}`);

      // Return the default color theme as a last resort
      return {
        ...defaultColorTheme,
        rawColors,
        isLoading: false
      };
    }
  }

  /**
   * Adjust the brightness of a color
   *
   * @param hex The hex color to adjust
   * @param percent The percentage to adjust by (positive for lighter, negative for darker)
   * @returns string The adjusted color
   */
  private static adjustBrightness(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
    g = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
    b = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
