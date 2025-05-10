'use client';

import { DanteLogger } from './DanteLogger';
import HesseColorTheory, { SalingerCtaColors, ComprehensiveColorPalette } from './HesseColorTheory';
import OpenAIColorAnalyzer from './OpenAIColorAnalyzer';
import { ColorTheory } from './ColorTheory';

// Define color theme interface
export interface ColorTheme {
  // Base colors (for backward compatibility)
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  isDark: boolean;
  isLoading: boolean;
  rawColors: string[];

  // Enhanced color system
  ctaColors?: SalingerCtaColors;

  // Comprehensive color palette with light/dark variants
  palette?: ComprehensiveColorPalette;
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
    DanteLogger.info.system(`🎨 Extracting colors from PDF: ${pdfUrl}`);

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

    // Simulate extracting colors from the PDF
    // In a real implementation, this would use PDF.js to extract actual colors
    const extractedColors = [
      '#3a6ea5', // Primary blue
      '#004e98', // Secondary blue
      '#ff6700', // Accent orange
      '#f6f6f6', // Background light gray
      '#333333', // Text dark gray
      '#c0c0c0', // Border medium gray
      '#ffffff', // White
      '#f0f0f0', // Light gray
      '#e0e0e0', // Medium light gray
      '#d0d0d0', // Medium gray
      '#b0b0b0', // Medium dark gray
      '#808080', // Dark gray
    ];

    // Use OpenAI to analyze and categorize the colors with retry logic
    DanteLogger.info.system(`🧠 Using OpenAI to analyze and categorize colors`);
    let analyzedTheme;

    // Retry configuration
    const maxRetries = 5;
    const initialDelay = 1000; // 1 second

    // Retry function with exponential backoff
    const retryWithBackoff = async (attempt: number): Promise<any> => {
      try {
        DanteLogger.info.system(`🔄 OpenAI analysis attempt ${attempt}/${maxRetries}`);
        return await OpenAIColorAnalyzer.analyzeColorsWithOpenAI(extractedColors);
      } catch (error) {
        // Log the error
        DanteLogger.error.runtime(`Error during OpenAI color analysis (attempt ${attempt}/${maxRetries}): ${error}`);

        // If we've reached the maximum number of retries, throw the error
        if (attempt >= maxRetries) {
          DanteLogger.error.runtime(`❌ Maximum retries (${maxRetries}) reached for OpenAI color analysis`);
          throw error;
        }

        // Calculate delay with exponential backoff (1s, 2s, 4s, 8s, 16s)
        const delay = initialDelay * Math.pow(2, attempt - 1);
        DanteLogger.info.system(`⏱️ Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);

        // Wait for the delay
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry
        return retryWithBackoff(attempt + 1);
      }
    };

    try {
      // Start the retry process
      analyzedTheme = await retryWithBackoff(1);
    } catch (analyzeError) {
      const errorMessage = analyzeError instanceof Error ? analyzeError.message : String(analyzeError);
      DanteLogger.error.runtime(`Error during OpenAI color analysis after ${maxRetries} attempts: ${errorMessage}`);
      console.error('OpenAI color analysis failed after multiple attempts:', analyzeError);
      // Continue with fallback approach
    }

    // If OpenAI analysis was successful, return the analyzed theme
    if (analyzedTheme && analyzedTheme.primary) {
      DanteLogger.success.ux(`🎨 Successfully analyzed colors with OpenAI`);
      DanteLogger.success.ux(`🖌️ Modal header color: ${analyzedTheme.palette?.ui.modalHeader}`);
      DanteLogger.success.ux(`🖌️ Modal body color: ${analyzedTheme.palette?.ui.modalBody}`);
      return analyzedTheme;
    }

    // If OpenAI analysis failed, fall back to the default approach
    DanteLogger.warn.runtime(`OpenAI color analysis failed, using fallback approach`);
    console.log('Using fallback color theme approach');

    // Use the consolidated ColorTheory utility to create a fallback theme
    const fallbackTheme = ColorTheory.createFallbackTheme(extractedColors);

    // Log the fallback theme details
    DanteLogger.info.system(`🎭 Generated fallback color theme`);
    DanteLogger.success.ux(`🖌️ Fallback primary color: ${fallbackTheme.primary}`);
    DanteLogger.success.ux(`🖌️ Fallback modal header color: ${fallbackTheme.palette?.ui.modalHeader}`);
    DanteLogger.success.ux(`🖌️ Fallback modal body color: ${fallbackTheme.palette?.ui.modalBody}`);

    return fallbackTheme;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    DanteLogger.error.runtime(`Failed to extract colors from PDF: ${errorMessage}`);
    console.error('Failed to extract colors from PDF:', error);

    // Use the createFallbackColorTheme function with an empty array of colors
    // This will use the default color theme
    const ultimateFallbackTheme = ColorTheory.createFallbackTheme([]);

    DanteLogger.warn.runtime(`Using ultimate fallback color theme due to extraction error`);

    return ultimateFallbackTheme;
  }
}
