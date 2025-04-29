import { NextRequest, NextResponse } from 'next/server';
import { processPdf } from '@/utils/pdfContentProcessor';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to pre-process the PDF content
 * This is called during SSR to ensure the content is ready
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Pre-processing PDF content');

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

    HesseLogger.summary.complete('PDF content pre-processed successfully');

    // Return success
    return NextResponse.json({
      success: true,
      message: 'PDF content pre-processed successfully',
      timestamp: new Date().toISOString(),
      contentFingerprint: result.contentFingerprint
    });
  } catch (error) {
    console.error('Error pre-processing PDF content:', error);
    HesseLogger.summary.error(`Error pre-processing PDF content: ${error}`);
    DanteLogger.error.system('Error pre-processing PDF content', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to pre-process PDF content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
