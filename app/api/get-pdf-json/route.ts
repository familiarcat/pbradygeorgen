import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    HesseLogger.ai.start('Retrieving PDF JSON content');

    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Path to the JSON file
    const jsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');

    // Check if we need to refresh the JSON content
    if (forceRefresh) {
      HesseLogger.ai.progress('Force refresh requested, extracting PDF content to JSON');

      // Path to the default PDF
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Run the extraction script
      await execAsync(`node scripts/extract-pdf-to-json.js "${pdfPath}"`);
      DanteLogger.success.core('PDF content extracted to JSON successfully');
    }

    // Check if the JSON file exists
    try {
      await fs.access(jsonPath);
    } catch (error) {
      // If the file doesn't exist, extract the content
      HesseLogger.ai.progress('JSON file not found, extracting PDF content');

      // Path to the default PDF
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Run the extraction script
      await execAsync(`node scripts/extract-pdf-to-json.js "${pdfPath}"`);
      DanteLogger.success.core('PDF content extracted to JSON successfully');
    }

    // Read the JSON file
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');

    // Parse the JSON content
    const content = JSON.parse(jsonContent);

    HesseLogger.ai.success('PDF JSON content retrieved successfully');

    // Return the JSON content
    return NextResponse.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Error retrieving PDF JSON content:', error);
    HesseLogger.ai.error(`Error retrieving PDF JSON content: ${error}`);
    DanteLogger.error.dataFlow('Error retrieving PDF JSON content', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve PDF JSON content',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
