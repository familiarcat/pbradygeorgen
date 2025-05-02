import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

const execAsync = promisify(exec);

/**
 * API route for extracting styling information from a PDF
 * This performs server-side extraction of colors, fonts, and layout information
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Extracting PDF styling information');

    // Get the PDF path from the query parameters or use the default
    const searchParams = request.nextUrl.searchParams;
    const pdfPath = searchParams.get('path') || 'default_resume.pdf';
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Always force refresh to ensure we're using fresh content
    // This ensures we're not using cached content that might be from a previous PDF
    const alwaysForceRefresh = true;

    // Construct the absolute path to the PDF
    const publicDir = path.join(process.cwd(), 'public');
    const absolutePdfPath = path.join(publicDir, pdfPath);

    // Check if the PDF exists
    if (!fs.existsSync(absolutePdfPath)) {
      DanteLogger.error.validation(`PDF file not found: ${absolutePdfPath}`);
      return NextResponse.json({
        success: false,
        error: 'PDF file not found'
      }, { status: 404 });
    }

    // Get PDF stats for logging
    const pdfStats = fs.statSync(absolutePdfPath);
    const pdfSize = pdfStats.size;
    const pdfModified = new Date(pdfStats.mtimeMs).toISOString();

    // Log PDF information
    console.log(`📄 PDF file: ${absolutePdfPath}`);
    console.log(`📊 Size: ${pdfSize} bytes`);
    console.log(`⏱️ Last modified: ${pdfModified}`);

    // Check if we need to refresh the extracted content
    const extractedDir = path.join(publicDir, 'extracted');
    const colorInfoPath = path.join(extractedDir, 'color_theme.json');
    const fontInfoPath = path.join(extractedDir, 'font_info.json');

    // Always force refresh to ensure we're using fresh content
    const needsRefresh = alwaysForceRefresh || forceRefresh;

    // If we need to refresh, run the extraction scripts
    if (needsRefresh) {
      DanteLogger.success.basic('Refreshing PDF style extraction');

      // Create the extracted directory if it doesn't exist
      if (!fs.existsSync(extractedDir)) {
        fs.mkdirSync(extractedDir, { recursive: true });
      }

      // Run the extraction scripts
      await execAsync(`node scripts/extract-pdf-fonts.js "${absolutePdfPath}"`);
      await execAsync(`node scripts/extract-pdf-colors.js "${absolutePdfPath}"`);

      DanteLogger.success.core('PDF style extraction completed');
    } else {
      DanteLogger.success.basic('Using cached PDF style extraction');
    }

    // Read the extracted style information
    let colorTheme = {};
    let fontInfo = {};

    if (fs.existsSync(colorInfoPath)) {
      const colorData = fs.readFileSync(colorInfoPath, 'utf8');
      colorTheme = JSON.parse(colorData);
    }

    if (fs.existsSync(fontInfoPath)) {
      const fontData = fs.readFileSync(fontInfoPath, 'utf8');
      fontInfo = JSON.parse(fontData);
    }

    // Read the name from the extracted markdown
    let name = 'Professional Resume';
    const markdownPath = path.join(extractedDir, 'resume_content.md');

    if (fs.existsSync(markdownPath)) {
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      const nameMatch = markdownContent.match(/^# (.+)$/m);

      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1];
      }
    }

    // Return the extracted style information
    return NextResponse.json({
      success: true,
      name,
      colorTheme,
      fontInfo,
      timestamp: Date.now()
    });
  } catch (error) {
    DanteLogger.error.runtime(`Error extracting PDF style: ${error}`);
    console.error('Error extracting PDF style:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to extract PDF style'
    }, { status: 500 });
  }
}
