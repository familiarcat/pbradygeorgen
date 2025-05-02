import { NextRequest, NextResponse } from 'next/server';
import { ContentStateService } from '@/utils/ContentStateService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to get the Cover Letter content
 *
 * This endpoint handles the generation of Cover Letter content,
 * ensuring it uses the latest PDF content and properly formats it.
 *
 * Philosophical Framework:
 * - Hesse: Balancing structure (API response) with flexibility (dynamic generation)
 * - Salinger: Ensuring authentic representation through content freshness checks
 * - Derrida: Deconstructing content into API response with metadata
 * - Dante: Guiding the request through different processing stages
 */
export async function GET(request: NextRequest) {
  try {
    // Begin the journey (Dante's navigation)
    const requestStart = Date.now();
    HesseLogger.summary.start('Getting Cover Letter content');

    // Get the query parameters (Derrida's deconstruction of the request)
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    const timestamp = searchParams.get('t'); // Cache-busting parameter
    const includeMetadata = searchParams.get('metadata') === 'true';

    console.log(`Cover Letter API called with forceRefresh=${forceRefresh}, timestamp=${timestamp}, includeMetadata=${includeMetadata}`);
    DanteLogger.success.basic(`Cover Letter API called with forceRefresh=${forceRefresh}`);

    // Get the content state service (Hesse's structured approach)
    const contentStateService = ContentStateService.getInstance();

    // Get the Cover Letter content using the unified approach (Salinger's authentic representation)
    console.log('Calling getFormattedContent for cover_letter...');
    const result = await contentStateService.getFormattedContent('cover_letter', 'markdown', forceRefresh);
    console.log('getFormattedContent result:', {
      success: result.success,
      isStale: result.isStale,
      contentLength: result.content?.length,
      format: result.metadata?.format,
      contentType: result.metadata?.contentType
    });

    if (!result.success) {
      console.error('Error formatting Cover Letter content:', result.message);
      DanteLogger.error.dataFlow(`Error formatting Cover Letter content: ${result.message}`);

      return NextResponse.json({
        success: false,
        error: result.message,
        isStale: result.isStale,
        timestamp: new Date().toISOString(),
        requestDuration: Date.now() - requestStart
      }, { status: 500 });
    }

    // Verify content is not empty
    if (!result.content || result.content.trim() === '') {
      const errorMsg = 'Cover Letter content is empty';
      console.error(errorMsg);
      DanteLogger.error.dataFlow(errorMsg);

      return NextResponse.json({
        success: false,
        error: errorMsg,
        isStale: true,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Log content length for debugging (Dante's journey completion)
    console.log(`Cover Letter content retrieved successfully (${result.content.length} characters)`);
    DanteLogger.success.core('Cover Letter content retrieved successfully');
    HesseLogger.summary.complete('Cover Letter content retrieved successfully');

    // Calculate request duration (Dante's journey metrics)
    const requestDuration = Date.now() - requestStart;

    // Construct response based on philosophical framework
    const responseData = {
      // Core response (Hesse's balanced structure)
      success: true,
      content: result.content,
      isStale: result.isStale,
      timestamp: new Date().toISOString(),
      requestDuration,

      // Include metadata if requested (Derrida's deeper deconstruction)
      ...(includeMetadata && result.metadata ? {
        metadata: {
          ...result.metadata,
          contentLength: result.content.length,
          processingStage: contentStateService.getState().processingStage
        }
      } : {})
    };

    // Return the Cover Letter content with cache control headers (Salinger's authentic delivery)
    return new NextResponse(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`
        }
      }
    );
  } catch (error) {
    console.error('Error getting Cover Letter content:', error);
    HesseLogger.summary.error(`Error getting Cover Letter content: ${error}`);
    DanteLogger.error.system('Error getting Cover Letter content', error);

    // Calculate request duration even for errors (Dante's complete journey)
    const requestDuration = Date.now() - requestStart;

    // Structured error response (Hesse's balanced approach to errors)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get Cover Letter content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        requestDuration,
        // Include error stage information (Dante's journey stage where error occurred)
        errorStage: 'api_processing'
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`,
          'X-Error-Stage': 'api_processing'
        }
      }
    );
  }
}
