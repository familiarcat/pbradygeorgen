/**
 * PDF Processing API Route
 *
 * This API route handles the processing of PDF files, including:
 * - Text extraction
 * - Color extraction
 * - Font extraction
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the API process
 * - Derrida: Deconstructing the PDF into its core elements
 */

import { NextRequest, NextResponse } from 'next/server';
import { DanteLogger } from '@/utils/DanteLogger';
import path from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const useDefault = formData.get('useDefault') === 'true';
    const extractColors = formData.get('extractColors') !== 'false';
    const extractFonts = formData.get('extractFonts') !== 'false';

    // Validate input
    if (!pdfFile && !useDefault) {
      DanteLogger.error.validation('No PDF file provided in process request');
      return NextResponse.json(
        { success: false, error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Process the PDF
    let pdfPath: string;
    let pdfUrl: string;

    if (useDefault) {
      // Use the default PDF
      pdfPath = path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
      pdfUrl = '/pbradygeorgen_resume.pdf';

      // Check if the default PDF exists
      if (!existsSync(pdfPath)) {
        DanteLogger.error.validation('Default PDF not found');
        return NextResponse.json(
          { success: false, error: 'Default PDF not found' },
          { status: 404 }
        );
      }
    } else {
      // Create a temporary file for the uploaded PDF
      const tempDir = path.join(process.cwd(), 'public', 'uploads');
      const timestamp = Date.now();
      const safeFileName = pdfFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
      const uniqueFileName = `${timestamp}_${safeFileName}`;
      const tempPath = path.join(tempDir, uniqueFileName);

      // Write the file to disk
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const fs = require('fs/promises');

      // Create the directory if it doesn't exist
      if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true });
      }

      // Write the file
      await fs.writeFile(tempPath, buffer);

      pdfPath = tempPath;
      pdfUrl = `/uploads/${uniqueFileName}`;
    }

    // Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!existsSync(extractedDir)) {
      const fs = require('fs/promises');
      await fs.mkdir(extractedDir, { recursive: true });
    }

    // Extract text content
    DanteLogger.success.basic('Extracting text from PDF');
    execSync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`, { stdio: 'inherit' });

    // Extract colors if requested
    let colorTheme = {};
    if (extractColors) {
      try {
        DanteLogger.success.basic('Extracting colors from PDF');
        execSync(`node scripts/extract-pdf-colors.js "${pdfPath}"`, { stdio: 'inherit' });

        // Read the color theme
        const fs = require('fs/promises');
        const colorTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'color_theory.json');
        const colorTheoryData = await fs.readFile(colorTheoryPath, 'utf8');
        colorTheme = JSON.parse(colorTheoryData);
      } catch (error) {
        DanteLogger.error.dataFlow('Error extracting colors', { error });
      }
    }

    // Extract fonts if requested
    let fontTheme = {};
    if (extractFonts) {
      try {
        DanteLogger.success.basic('Extracting fonts from PDF');
        execSync(`node scripts/extract-pdf-fonts.js "${pdfPath}"`, { stdio: 'inherit' });

        // Read the font theme
        const fs = require('fs/promises');
        const fontTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'font_theory.json');
        const fontTheoryData = await fs.readFile(fontTheoryPath, 'utf8');
        fontTheme = JSON.parse(fontTheoryData);
      } catch (error) {
        DanteLogger.error.dataFlow('Error extracting fonts', { error });
      }
    }

    // Generate improved markdown
    DanteLogger.success.basic('Generating improved markdown');
    execSync(`node scripts/generate-improved-markdown.js "public/extracted/resume_content.txt"`, { stdio: 'inherit' });

    // Read the extracted content
    const fs = require('fs/promises');
    const textPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.txt');
    const markdownPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

    let textContent = '';
    let markdownContent = '';

    try {
      textContent = await fs.readFile(textPath, 'utf8');
      markdownContent = await fs.readFile(markdownPath, 'utf8');
    } catch (error) {
      DanteLogger.error.dataFlow('Error reading extracted content', { error });
    }

    // Return the results
    return NextResponse.json({
      success: true,
      pdfUrl,
      colorTheme,
      fontTheme,
      textContent: textContent.substring(0, 500) + '...',
      markdownContent: markdownContent.substring(0, 500) + '...',
      extractionComplete: true
    });
  } catch (error) {
    DanteLogger.error.system('Error in PDF processing API', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
