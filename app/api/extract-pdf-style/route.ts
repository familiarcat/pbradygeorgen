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

    // Check if we need to refresh the extracted content
    const extractedDir = path.join(publicDir, 'extracted');
    const colorInfoPath = path.join(extractedDir, 'color_theme.json');
    const fontInfoPath = path.join(extractedDir, 'font_info.json');

    let needsRefresh = forceRefresh;

    if (!needsRefresh) {
      // Check if the extracted files exist and are newer than the PDF
      const pdfStats = fs.statSync(absolutePdfPath);

      if (!fs.existsSync(colorInfoPath) || !fs.existsSync(fontInfoPath)) {
        needsRefresh = true;
      } else {
        const colorStats = fs.statSync(colorInfoPath);
        const fontStats = fs.statSync(fontInfoPath);

        // If the PDF is newer than the extracted files, we need to refresh
        if (pdfStats.mtime > colorStats.mtime || pdfStats.mtime > fontStats.mtime) {
          needsRefresh = true;
        }
      }
    }

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
