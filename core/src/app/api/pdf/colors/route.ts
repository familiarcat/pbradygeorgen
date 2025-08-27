/**
 * PDF Colors API Route
 *
 * This API route returns the color theme extracted from a PDF.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the API process
 * - Hesse: Mathematical precision in color extraction
 */

import { NextRequest, NextResponse } from 'next/server';
import { DanteLogger } from '@/utils/DanteLogger';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
// Define the ColorTheme interface and default theme here since we can't import it
interface ColorTheme {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  isDark?: boolean;
  isLoading?: boolean;
  rawColors?: string[];
  ctaColors?: {
    primary: string;
    hover: string;
    active: string;
    disabled: string;
    text: string;
  };
}

const defaultColorTheme: ColorTheme = {
  primary: '#3a6ea5',
  secondary: '#004e98',
  accent: '#ff6700',
  background: '#ffffff',
  text: '#000000',
  textSecondary: '#333333',
  border: '#dddddd',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  isLoading: false
};

export async function GET(request: NextRequest) {
  try {
    // Get the PDF URL from the query parameters
    const { searchParams } = new URL(request.url);
    const pdfUrl = searchParams.get('pdfUrl');

    if (!pdfUrl) {
      DanteLogger.error.validation('No PDF URL provided in colors request');
      return NextResponse.json(
        { success: false, error: 'No PDF URL provided' },
        { status: 400 }
      );
    }

    // Extract the PDF filename from the URL
    const pdfFilename = pdfUrl.split('/').pop();

    // Try to load the color theme from the extracted directory
    const colorTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'color_theory.json');

    if (existsSync(colorTheoryPath)) {
      try {
        // Read the color theory file
        const colorTheoryData = await fs.readFile(colorTheoryPath, 'utf8');
        const colorTheme = JSON.parse(colorTheoryData);

        DanteLogger.success.basic('Color theme loaded from file');

        return NextResponse.json({
          success: true,
          ...colorTheme,
          isLoading: false
        });
      } catch (error) {
        DanteLogger.error.dataFlow('Error reading color theory file', { error });
      }
    }

    // If we couldn't load the color theme, return the default
    DanteLogger.success.basic('Color theme not found, using default');

    return NextResponse.json({
      success: true,
      ...defaultColorTheme,
      isLoading: false
    });
  } catch (error) {
    DanteLogger.error.system('Error in PDF colors API', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to get PDF colors' },
      { status: 500 }
    );
  }
}
