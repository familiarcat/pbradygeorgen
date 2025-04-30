import { NextRequest, NextResponse } from 'next/server';
import { ContentStateService } from '@/utils/ContentStateService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to get the Cover Letter content
 * 
 * This endpoint handles the generation of Cover Letter content,
 * ensuring it uses the latest PDF content and properly formats it.
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Getting Cover Letter content');
    
    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    
    // Get the content state service
    const contentStateService = ContentStateService.getInstance();
    
    // Format the Cover Letter content
    const result = await contentStateService.formatCoverLetterContent(forceRefresh);
    
    if (!result.success) {
      DanteLogger.error.dataFlow(`Error formatting Cover Letter content: ${result.message}`);
      
      return NextResponse.json({
        success: false,
        error: result.message,
        isStale: result.isStale,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    DanteLogger.success.core('Cover Letter content retrieved successfully');
    HesseLogger.summary.complete('Cover Letter content retrieved successfully');
    
    // Return the Cover Letter content
    return NextResponse.json({
      success: true,
      content: result.content,
      isStale: result.isStale,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting Cover Letter content:', error);
    HesseLogger.summary.error(`Error getting Cover Letter content: ${error}`);
    DanteLogger.error.system('Error getting Cover Letter content', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Cover Letter content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
