import { NextRequest, NextResponse } from 'next/server';
import { getAnalyzedContent } from '@/utils/pdfContentProcessor';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to get the analyzed content
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Getting analyzed content');

    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Get the analyzed content
    const analyzedContent = await getAnalyzedContent(forceRefresh);

    HesseLogger.summary.complete('Analyzed content retrieved successfully');

    // Return the analyzed content
    return NextResponse.json({
      success: true,
      data: analyzedContent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting analyzed content:', error);
    HesseLogger.summary.error(`Error getting analyzed content: ${error}`);
    DanteLogger.error.system('Error getting analyzed content', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get analyzed content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
