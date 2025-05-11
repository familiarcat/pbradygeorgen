'use client';

import { DanteLogger } from '../../../core/logger/dante/DanteLogger';
import { HesseLogger } from '../../../core/logger/hesse/HesseLogger';
import { ColorTheme, defaultColorTheme } from '../../extraction/SimplePDFColorExtractor';
import * as HesseColorTheoryModule from '../color/HesseColorTheory';
import { ColorTheory } from '../color/ColorTheory';
import { PhilosophicalLogger } from '../../../core/logger/philosophical/PhilosophicalLogger';
import { Result, ok, err, tryCatchAsync } from '../../../core/result/Result';
import { OpenAIResponse } from '../../../core/types/types';

// Handle both default and named exports for HesseColorTheory
const HesseColorTheory = HesseColorTheoryModule.default || HesseColorTheoryModule;

// Cache for OpenAI responses
interface ColorAnalysisCache {
  [key: string]: {
    timestamp: number;
    result: ColorTheme;
  }
}

// In-memory cache for OpenAI responses
const colorAnalysisCache: ColorAnalysisCache = {};

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// OpenAI API key from environment variable
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

/**
 * Interface for color analysis result from OpenAI
 */
interface OpenAIColorAnalysisResult {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  ui: {
    modalHeader: string;
    modalBody: string;
    headerBackground: string;
  };
  isDark: boolean;
  explanation: string;
}

/**
 * Analyze colors using OpenAI to categorize them into a cohesive theme
 * Uses the Result pattern for error handling
 *
 * @param rawColors Array of hex colors extracted from the PDF
 * @param forceRefresh Whether to force a refresh of the cache
 * @returns Promise<Result<ColorTheme, Error>> The categorized color theme or an error
 */
export async function analyzeColorsWithOpenAI(
  rawColors: string[],
  forceRefresh: boolean = false
): Promise<Result<ColorTheme, Error>> {
  try {
    // Use PhilosophicalLogger for more robust logging
    try {
      HesseLogger.ai.start('Analyzing colors with OpenAI');
    } catch (logError) {
      // Silent catch
    }

    try {
      DanteLogger.info.system('🎨 Analyzing colors with OpenAI');
    } catch (logError) {
      // Silent catch
    }

    // Always log to console as a fallback
    console.log('🎨 Analyzing colors with OpenAI');

    // Use PhilosophicalLogger for more robust logging
    PhilosophicalLogger.ai.start('Analyzing colors with OpenAI');

    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY) {
      try {
        HesseLogger.ai.warning('OpenAI API key is not available');
      } catch (logError) {
        // Silent catch
      }

      try {
        DanteLogger.warn.security('OpenAI API key is not available, using fallback color analysis');
      } catch (logError) {
        // Silent catch
      }

      // Always log to console as a fallback
      console.warn('OpenAI API key is not available, using fallback color analysis');

      // Use PhilosophicalLogger for more robust logging
      PhilosophicalLogger.ai.warning('OpenAI API key is not available');

      // Return a Result with the fallback theme
      const fallbackResult = await tryCatchAsync(() => createFallbackColorTheme(rawColors));
      return fallbackResult;
    }

    // Create a cache key from the raw colors
    const cacheKey = rawColors.sort().join(',');

    // Check if we have a cached result and it's not expired
    if (!forceRefresh &&
        colorAnalysisCache[cacheKey] &&
        Date.now() - colorAnalysisCache[cacheKey].timestamp < CACHE_EXPIRATION) {
      try {
        HesseLogger.ai.info('Using cached color analysis result');
      } catch (logError) {
        // Silent catch
      }

      try {
        DanteLogger.info.system('🎨 Using cached color analysis result');
      } catch (logError) {
        // Silent catch
      }

      // Use PhilosophicalLogger for more robust logging
      PhilosophicalLogger.ai.info('Using cached color analysis result');

      // Return a Result with the cached theme
      return ok(colorAnalysisCache[cacheKey].result);
    }

    // Check if we have colors to analyze
    if (!rawColors || rawColors.length === 0) {
      try {
        HesseLogger.ai.warning('No colors to analyze');
      } catch (logError) {
        // Silent catch
      }

      try {
        DanteLogger.warn.runtime('No colors to analyze, using fallback color theme');
      } catch (logError) {
        // Silent catch
      }

      // Use PhilosophicalLogger for more robust logging
      PhilosophicalLogger.ai.warning('No colors to analyze');

      // Return a Result with the fallback theme
      const fallbackResult = await tryCatchAsync(() => createFallbackColorTheme([]));
      return fallbackResult;
    }

    // Create the prompt for OpenAI
    const prompt = createColorAnalysisPrompt(rawColors);

    // Call OpenAI API
    const startTime = Date.now();
    HesseLogger.openai.request('Sending colors to OpenAI for analysis');
    DanteLogger.info.system('🧠 Sending colors to OpenAI for analysis');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a color theory expert that analyzes colors and categorizes them into a cohesive theme.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    const endTime = Date.now();
    HesseLogger.openai.response(`OpenAI response received in ${endTime - startTime}ms`);
    DanteLogger.success.system(`🧠 OpenAI response received in ${endTime - startTime}ms`);

    // Parse the response
    if (!response.ok) {
      try {
        // Try to parse the error response as JSON
        const errorData = await response.json();

        // Log the raw error data for debugging
        console.log('OpenAI API error response:', errorData);

        // Check if the error object exists
        if (errorData && typeof errorData === 'object') {
          let errorMessage = 'Unknown API error';

          // Safely extract error message with proper null/undefined checks
          if (errorData.error) {
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (typeof errorData.error === 'object' && errorData.error !== null) {
              if (errorData.error.message) {
                errorMessage = errorData.error.message;
              } else {
                errorMessage = JSON.stringify(errorData.error);
              }
            }
          } else {
            // If no error property, use the entire response as the error message
            errorMessage = JSON.stringify(errorData);
          }

          DanteLogger.error.runtime(`OpenAI API error (${response.status}): ${errorMessage}`);
          throw new Error(`OpenAI API error: ${response.status} ${errorMessage}`);
        } else {
          // If the error object doesn't have the expected structure
          DanteLogger.error.runtime(`OpenAI API error (${response.status}): Unexpected error format`);
          throw new Error(`OpenAI API error: ${response.status} Unexpected error format`);
        }
      } catch (parseError) {
        // Log the parse error
        console.error('Error parsing OpenAI error response:', parseError);

        // If we can't parse the error as JSON, try to get the raw text
        try {
          const errorText = await response.text();
          DanteLogger.error.runtime(`OpenAI API error (${response.status}): ${errorText}`);
          throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
        } catch (textError) {
          // If we can't even get the text, use a generic error message
          console.error('Error getting error text:', textError);
          DanteLogger.error.runtime(`OpenAI API error (${response.status}): Could not read error response`);
          throw new Error(`OpenAI API error: ${response.status} Could not read error response`);
        }
      }
    }

    // Parse the response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      DanteLogger.error.runtime(`Error parsing OpenAI response JSON: ${jsonError}`);
      throw new Error(`Error parsing OpenAI response: ${jsonError}`);
    }

    // Validate the response structure
    if (!responseData || !responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      DanteLogger.error.runtime('Invalid OpenAI response structure');
      throw new Error('Invalid OpenAI response structure');
    }

    // Extract the content from the response
    const content = responseData.choices[0].message.content;

    // Validate the content
    if (!content) {
      DanteLogger.error.runtime('Empty content in OpenAI response');
      throw new Error('Empty content in OpenAI response');
    }

    // Parse the JSON from the content
    let parsedContent: OpenAIColorAnalysisResult;
    try {
      parsedContent = JSON.parse(content);

      // Validate the parsed content
      if (!parsedContent || typeof parsedContent !== 'object') {
        throw new Error('Invalid JSON format in OpenAI response');
      }

      // Validate required fields
      const requiredFields = ['primary', 'secondary', 'accent', 'background', 'text', 'border', 'ui'];
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field in OpenAI response: ${field}`);
        }
      }

      // Validate UI fields
      const requiredUIFields = ['modalHeader', 'modalBody', 'headerBackground'];
      for (const field of requiredUIFields) {
        if (!parsedContent.ui[field]) {
          throw new Error(`Missing required UI field in OpenAI response: ${field}`);
        }
      }

      // Log the analysis
      HesseLogger.ai.success('Color analysis completed successfully');
      DanteLogger.success.ux(`🎨 Color analysis completed successfully`);
      DanteLogger.success.ux(`🎨 Primary color: ${parsedContent.primary}`);
      DanteLogger.success.ux(`🎨 Secondary color: ${parsedContent.secondary}`);
      DanteLogger.success.ux(`🎨 Accent color: ${parsedContent.accent}`);
      DanteLogger.success.ux(`🎨 Modal header color: ${parsedContent.ui.modalHeader}`);
    } catch (error) {
      HesseLogger.ai.error(`Error parsing OpenAI response: ${error}`);
      DanteLogger.error.runtime(`Error parsing OpenAI response: ${error}`);
      throw new Error(`Error parsing OpenAI response: ${error}`);
    }

    // Generate CTA colors using the consolidated ColorTheory utility
    const ctaColors = ColorTheory.generateCtaColors(parsedContent.primary);

    // Generate comprehensive color palette with light/dark variants
    const comprehensivePalette = ColorTheory.generateColorPalette(
      parsedContent.primary,
      parsedContent.secondary,
      parsedContent.accent,
      parsedContent.background,
      parsedContent.text,
      parsedContent.border,
      parsedContent.isDark
    );

    // Override UI-specific colors with the ones from OpenAI
    comprehensivePalette.ui.modalHeader = parsedContent.ui.modalHeader;
    comprehensivePalette.ui.modalBody = parsedContent.ui.modalBody;
    comprehensivePalette.ui.headerBackground = parsedContent.ui.headerBackground;

    // Create the theme with enhanced color system
    const result = {
      primary: parsedContent.primary,
      secondary: parsedContent.secondary,
      accent: parsedContent.accent,
      background: parsedContent.background,
      text: parsedContent.text,
      border: parsedContent.border,
      isDark: parsedContent.isDark,
      isLoading: false,
      rawColors,
      ctaColors,
      palette: comprehensivePalette
    };

    // Cache the result
    colorAnalysisCache[cacheKey] = {
      timestamp: Date.now(),
      result
    };

    try {
      DanteLogger.info.system('🎨 Cached color analysis result');
    } catch (logError) {
      // Silent catch
    }

    // Use PhilosophicalLogger for more robust logging
    PhilosophicalLogger.system.info('Cached color analysis result');

    // Return a Result with the result
    return ok(result);
  } catch (error) {
    // Safely convert error to string to avoid "Cannot read properties of undefined" errors
    const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');

    try {
      HesseLogger.ai.error(`Error analyzing colors with OpenAI: ${errorMessage}`);
    } catch (logError) {
      // Silent catch
    }

    try {
      DanteLogger.error.runtime(`Error analyzing colors with OpenAI: ${errorMessage}`);
    } catch (logError) {
      // Silent catch
    }

    // Always log to console as a fallback
    console.error(`Error analyzing colors with OpenAI: ${errorMessage}`, error || 'Unknown error');

    // Use PhilosophicalLogger for more robust logging
    PhilosophicalLogger.ai.error(`Error analyzing colors with OpenAI: ${errorMessage}`);

    // Return a Result with the fallback theme
    const fallbackResult = await tryCatchAsync(() => createFallbackColorTheme(rawColors));
    return fallbackResult;
  }
}

/**
 * Create a prompt for OpenAI to analyze colors
 *
 * @param rawColors Array of hex colors extracted from the PDF
 * @returns string The prompt for OpenAI
 */
function createColorAnalysisPrompt(rawColors: string[]): string {
  return `
I have extracted the following colors from a PDF document (likely a resume or professional document).
Please analyze these colors and categorize them into a cohesive color theme following color theory principles.

EXTRACTED COLORS (hex format):
${rawColors.join(', ')}

Please categorize these colors into the following categories with careful consideration of their roles:

PRIMARY COLOR SELECTION:
- Primary color: The main brand color that should be used for primary elements and CTAs
  * Should be visually prominent and represent the main identity
  * Often used for buttons, links, and primary UI elements
  * Should have good contrast with background colors
  * Look for colors that appear frequently in headings or important sections of the PDF
  * This color should feel like the "signature color" of the document

SECONDARY COLOR SELECTION:
- Secondary color: A complementary or analogous color to the primary
  * Should work harmoniously with the primary color
  * Used for secondary elements, highlights, and supporting UI
  * Should be distinct from but complementary to the primary color
  * Often appears in subheadings or secondary sections of the PDF
  * Should provide good visual balance with the primary color

ACCENT COLOR SELECTION:
- Accent color: A contrasting color for highlights and special elements
  * Should create visual interest and draw attention to important elements
  * Used sparingly for highlights, badges, or important notifications
  * Should stand out from both primary and secondary colors
  * Often appears in bullet points, links, or call-to-action elements
  * Should provide a "pop" of color that draws the eye

BACKGROUND AND TEXT COLORS:
- Background color: The main background color
  * Usually light (unless it's a dark theme)
  * Should provide good contrast with text
  * Should be neutral enough to not compete with content
  * Often the most prevalent color in the PDF (the "canvas" color)
  * Should feel comfortable for extended reading
- Text color: The main text color
  * Should have excellent contrast with the background (WCAG AA minimum)
  * Usually dark on light backgrounds or light on dark backgrounds
  * The color used for the majority of text content in the PDF
  * Should be easy to read and not cause eye strain
- Border color: Color for borders and dividers
  * Should be subtle and not visually distracting
  * Often a lighter or darker variant of the background color
  * Used for separating content sections without drawing attention
  * Should provide just enough contrast to be visible but not prominent

UI-SPECIFIC COLORS:
- Modal header background: Color for modal headers
  * Should be derived from primary or secondary color
  * Should have good contrast with light text
  * Should visually distinguish the header from the modal body
  * Often a slightly darker or more saturated version of the primary color
  * Should feel like a natural extension of the color theme
- Modal body background: Color for modal bodies
  * Should be light but distinct from the main background
  * Should provide good contrast for content
  * Often a very subtle variant of the main background color
  * Should feel like a focused reading area
- Header background: Color for the main application header
  * Should be consistent with the overall theme
  * Often uses the primary color or a variant of it
  * Should provide good contrast with header text
  * Should feel like a natural part of the navigation system

COLOR THEORY CONSIDERATIONS:
- Consider color harmony principles (complementary, analogous, triadic)
- Ensure sufficient contrast for accessibility (WCAG AA compliance)
- Create a cohesive palette that works together
- Consider the emotional impact and psychological associations of colors
- Analyze the PDF's intended purpose and audience when selecting colors
- Maintain the "personality" of the original document in your color selections

Also determine if this is a dark theme (true/false) based on the background and text colors.

Provide your response in the following JSON format:
{
  "primary": "#hexcolor",
  "secondary": "#hexcolor",
  "accent": "#hexcolor",
  "background": "#hexcolor",
  "text": "#hexcolor",
  "border": "#hexcolor",
  "ui": {
    "modalHeader": "#hexcolor",
    "modalBody": "#hexcolor",
    "headerBackground": "#hexcolor"
  },
  "isDark": boolean,
  "explanation": "Detailed explanation of your color choices, the color theory principles applied, and how the colors work together to create a cohesive theme"
}

Important guidelines:
1. Ensure the modal header color has good contrast with light text (minimum 4.5:1 ratio)
2. The background should be light (unless it's a dark theme)
3. Text color should have high contrast with the background (minimum 4.5:1 ratio)
4. Use the most prominent colors from the extraction for primary/secondary/accent
5. If certain categories are missing from the extraction, derive appropriate colors that complement the existing ones
6. Pay special attention to the relationship between primary, secondary, and accent colors to ensure they work harmoniously
7. Consider the psychological impact of colors (e.g., blue for trust, green for growth, etc.)
8. Ensure the color palette feels cohesive and intentional, not random or disconnected
`;
}

/**
 * Create a fallback color theme when OpenAI analysis fails
 * Uses the Result pattern for error handling
 *
 * @param rawColors Array of hex colors extracted from the PDF
 * @returns Promise<ColorTheme> The fallback color theme
 */
async function createFallbackColorTheme(rawColors: string[]): Promise<ColorTheme> {
  try {
    // Log the raw colors for debugging
    console.log('Creating fallback color theme with raw colors:', rawColors);

    try {
      DanteLogger.info.system(`Creating fallback color theme with ${rawColors.length} raw colors`);
    } catch (logError) {
      // Silent catch
    }

    // Use PhilosophicalLogger for more robust logging
    PhilosophicalLogger.system.info(`Creating fallback color theme with ${rawColors.length} raw colors`);

    // Use the consolidated ColorTheory utility to create a fallback theme
    try {
      return ColorTheory.createFallbackTheme(rawColors);
    } catch (colorTheoryError) {
      // Log the error
      const errorMessage = colorTheoryError instanceof Error ? colorTheoryError.message : String(colorTheoryError || 'Unknown error');
      console.error(`Error in ColorTheory.createFallbackTheme: ${errorMessage}`);

      // Use PhilosophicalLogger for more robust logging
      PhilosophicalLogger.error.runtime(`Error in ColorTheory.createFallbackTheme: ${errorMessage}`);

      // Return the default color theme as a fallback
      return {
        ...defaultColorTheme,
        rawColors,
        isLoading: false
      };
    }
  } catch (error) {
    // Safely convert error to string to avoid "Cannot read properties of undefined" errors
    const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');

    console.error('Error creating fallback color theme:', errorMessage);

    try {
      DanteLogger.error.runtime(`Error creating fallback color theme: ${errorMessage}`);
    } catch (logError) {
      // Silent catch
    }

    // Use PhilosophicalLogger for more robust logging
    PhilosophicalLogger.error.runtime(`Error creating fallback color theme: ${errorMessage}`);

    // Return the default color theme as a last resort
    return {
      ...defaultColorTheme,
      rawColors,
      isLoading: false
    };
  }
}

// Export as default for backward compatibility
export default {
  analyzeColorsWithOpenAI,
  createFallbackColorTheme
};
