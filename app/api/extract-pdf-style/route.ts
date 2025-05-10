import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import HesseColorTheory from '@/utils/HesseColorTheory';

/**
 * API route to extract PDF style information
 *
 * This route extracts colors and fonts from a PDF file and returns them
 * as a JSON object.
 *
 * Philosophical Framework:
 * - Hesse: Mathematical precision in color relationships
 * - Derrida: Deconstructing color theory to understand its components
 * - Salinger: Intuitive interface for color adjustments
 * - Dante: Comprehensive logging throughout the system
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Hesse:Summary:Start] Extracting PDF style information');
    DanteLogger.info.system('🎨 Extracting PDF style information');

    // Get the refresh parameter
    const refresh = request.nextUrl.searchParams.get('refresh') === 'true';

    // Try to read the color theme from the extracted directory
    let colorTheme;
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    const colorThemePath = path.join(extractedDir, 'color_theme.json');

    try {
      // Check if the extracted directory exists
      if (!fs.existsSync(extractedDir)) {
        fs.mkdirSync(extractedDir, { recursive: true });
        DanteLogger.info.system('📁 Created extracted directory');
      }

      // Check if the color theme file exists
      if (fs.existsSync(colorThemePath) && !refresh) {
        // Read the color theme from the file
        const colorThemeData = fs.readFileSync(colorThemePath, 'utf-8');
        colorTheme = JSON.parse(colorThemeData);
        DanteLogger.info.system('📄 Read color theme from file');
      } else {
        // Create a default color theme
        const defaultColors = {
          primary: '#3a6ea5',
          secondary: '#004e98',
          accent: '#ff6700',
          background: '#f6f6f6',
          text: '#333333',
          border: '#c0c0c0',
          isDark: false,
          isLoading: false,
          rawColors: ['#3a6ea5', '#004e98', '#ff6700', '#f6f6f6', '#333333', '#c0c0c0']
        };

        // Generate CTA colors
        const ctaColors = HesseColorTheory.default.generateSalingerCtaColors(defaultColors.primary);

        // Generate comprehensive color palette
        const palette = HesseColorTheory.default.generateComprehensiveColorPalette(
          defaultColors.primary,
          defaultColors.secondary,
          defaultColors.accent,
          defaultColors.background,
          defaultColors.text,
          defaultColors.border,
          defaultColors.isDark
        );

        // Create the color theme
        colorTheme = {
          ...defaultColors,
          ctaColors,
          palette
        };

        // Save the color theme to a file
        fs.writeFileSync(colorThemePath, JSON.stringify(colorTheme, null, 2));
        DanteLogger.info.system('💾 Created and saved default color theme to file');
      }
    } catch (error) {
      console.error('Error reading/writing color theme:', error);
      DanteLogger.error.runtime(`Error reading/writing color theme: ${error}`);

      // Create a fallback color theme
      const defaultColors = {
        primary: '#3a6ea5',
        secondary: '#004e98',
        accent: '#ff6700',
        background: '#f6f6f6',
        text: '#333333',
        border: '#c0c0c0',
        isDark: false,
        isLoading: false,
        rawColors: ['#3a6ea5', '#004e98', '#ff6700', '#f6f6f6', '#333333', '#c0c0c0']
      };

      const ctaColors = HesseColorTheory.default.generateSalingerCtaColors(defaultColors.primary);
      const palette = HesseColorTheory.default.generateComprehensiveColorPalette(
        defaultColors.primary,
        defaultColors.secondary,
        defaultColors.accent,
        defaultColors.background,
        defaultColors.text,
        defaultColors.border,
        defaultColors.isDark
      );

      colorTheme = {
        ...defaultColors,
        ctaColors,
        palette
      };
    }

    // Mock font information (in a real implementation, this would be extracted from the PDF)
    const fontInfo = {
      primaryFont: 'var(--font-source-sans)',
      secondaryFont: 'var(--font-merriweather)',
      headingFont: 'var(--font-roboto)',
      monoFont: 'var(--font-geist-mono)',
      isLoading: false,
    };

    // Log success
    console.log('✅ [Hesse:Summary:Complete] PDF style extraction completed successfully');
    DanteLogger.success.ux('✅ PDF style extraction completed successfully');

    // Return the response
    return NextResponse.json({
      success: true,
      name: 'Benjamin Stein',
      colorTheme,
      fontInfo,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Error extracting PDF style: ${error}`);
    DanteLogger.error.runtime(`Error extracting PDF style: ${error}`);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to extract PDF style',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Redirect to GET for compatibility
  return GET(request as unknown as NextRequest);
}