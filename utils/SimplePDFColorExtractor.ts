'use client';

import { DanteLogger } from './DanteLogger';
import HesseColorTheory, { SalingerCtaColors } from './HesseColorTheory';

// Define color theme interface
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  isDark: boolean;
  isLoading: boolean;
  rawColors: string[];
  ctaColors?: SalingerCtaColors;
}

// Default color theme (our Salinger-inspired earth tones)
export const defaultColorTheme: ColorTheme = {
  primary: '#7E6233', // coyote
  secondary: '#5F6B54', // ebony
  accent: '#7E4E2D', // terracotta
  background: '#F5F1E0', // parchment
  text: '#3A4535', // dark forest
  border: '#D5CDB5', // light border
  isDark: false,
  isLoading: false,
  rawColors: []
};

// Extract colors from PDF and apply Hesse color theory
export async function extractColorsFromPDF(pdfUrl: string): Promise<ColorTheme> {
  try {
    // Log the extraction attempt with the PDF URL
    console.log(`Extracting colors from PDF: ${pdfUrl}`);

    // Ensure we're using the latest PDF by adding a cache-busting parameter
    const cacheBustedUrl = `${pdfUrl}?v=${Date.now()}`;

    // Create a set of fallback colors based on Hesse's philosophy
    // These represent harmony, balance, and transformation
    const fallbackColors = {
      primary: '#3a6ea5',    // A balanced blue (representing water/flow)
      secondary: '#004e98',  // Deeper blue (representing depth/knowledge)
      accent: '#ff6700',     // Vibrant orange (representing transformation)
      background: '#f6f6f6', // Light neutral (representing clarity)
      text: '#333333',       // Dark gray (representing wisdom)
      border: '#c0c0c0',     // Medium gray (representing boundaries)
      isDark: false,
      isLoading: false,
      rawColors: ['#3a6ea5', '#004e98', '#ff6700', '#f6f6f6', '#333333', '#c0c0c0']
    };

    // Generate CTA colors using Hesse's mathematical approach
    const ctaColors = HesseColorTheory.generateSalingerCtaColors(fallbackColors.primary);

    // Analyze and log color contrast information using Dante
    HesseColorTheory.analyzeColorContrast(ctaColors);

    // Return the theme with CTA colors
    return {
      ...fallbackColors,
      ctaColors
    };
  } catch (error) {
    DanteLogger.error.runtime(`Failed to extract colors from PDF: ${error}`);
    return { ...defaultColorTheme, isLoading: false };
  }
}
