import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { processPdf, getAnalyzedContent } from '@/utils/pdfContentProcessor';

export async function GET(request: NextRequest) {
  try {
    HesseLogger.ai.start('Analyzing PDF content with ChatGPT');

    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Process the PDF
    const result = await processPdf(pdfPath, forceRefresh);

    if (!result.success) {
      throw new Error(result.message);
    }

    HesseLogger.ai.success('PDF content analysis retrieved successfully');

    // Return the extracted content and the analyzed content
    return NextResponse.json({
      success: true,
      originalContent: result.extractedContent,
      analyzedContent: result.analyzedContent
    });
  } catch (error) {
    console.error('Error analyzing PDF content:', error);
    HesseLogger.ai.error(`Error analyzing PDF content: ${error}`);
    DanteLogger.error.dataFlow('Error analyzing PDF content', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze PDF content',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
