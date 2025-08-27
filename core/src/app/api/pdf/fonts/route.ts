/**
 * PDF Fonts API Route
 *
 * This API route returns the font theme extracted from a PDF.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the API process
 * - Hesse: Mathematical precision in font extraction
 */

import { NextRequest, NextResponse } from 'next/server';
import { DanteLogger } from '@/utils/DanteLogger';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
// Define the FontTheme interface and default theme here since we can't import it
interface FontTheme {
  heading: string;
  body: string;
  mono: string;
  allFonts: string[];
}

const defaultFontTheme: FontTheme = {
  heading: "'Arial', sans-serif",
  body: "'Helvetica', Arial, sans-serif",
  mono: "'Courier New', monospace",
  allFonts: ['Arial', 'Helvetica', 'Courier New']
};

export async function GET(request: NextRequest) {
  try {
    // Get the PDF URL from the query parameters
    const { searchParams } = new URL(request.url);
    const pdfUrl = searchParams.get('pdfUrl');

    if (!pdfUrl) {
      DanteLogger.error.validation('No PDF URL provided in fonts request');
      return NextResponse.json(
        { success: false, error: 'No PDF URL provided' },
        { status: 400 }
      );
    }

    // Extract the PDF filename from the URL
    const pdfFilename = pdfUrl.split('/').pop();

    // Try to load the font theme from the extracted directory
    const fontTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'font_theory.json');

    if (existsSync(fontTheoryPath)) {
      try {
        // Read the font theory file
        const fontTheoryData = await fs.readFile(fontTheoryPath, 'utf8');
        const fontTheme = JSON.parse(fontTheoryData);

        DanteLogger.success.basic('Font theme loaded from file');

        return NextResponse.json({
          success: true,
          ...fontTheme
        });
      } catch (error) {
        DanteLogger.error.dataFlow('Error reading font theory file', { error });
      }
    }

    // If we couldn't load the font theme, return the default
    DanteLogger.success.basic('Font theme not found, using default');

    return NextResponse.json({
      success: true,
      ...defaultFontTheme
    });
  } catch (error) {
    DanteLogger.error.system('Error in PDF fonts API', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to get PDF fonts' },
      { status: 500 }
    );
  }
}
