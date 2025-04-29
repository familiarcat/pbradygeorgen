import { NextRequest, NextResponse } from 'next/server';
import { validateAnalyzedContent } from '@/utils/pdfContentProcessor';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to validate content against Zod schemas
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Validating PDF content');
    DanteLogger.success.core('Starting content validation');

    // Validate the analyzed content
    const validationResult = await validateAnalyzedContent();

    if (!validationResult.valid) {
      DanteLogger.error.dataFlow('Content validation failed');
      HesseLogger.summary.error('Content validation failed');

      return NextResponse.json({
        success: true,
        valid: false,
        errors: validationResult.errors,
        timestamp: new Date().toISOString()
      });
    }

    DanteLogger.success.core('Content validation successful');
    HesseLogger.summary.complete('Content validation successful');

    return NextResponse.json({
      success: true,
      valid: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error validating content:', error);
    HesseLogger.summary.error(`Error validating content: ${error}`);
    DanteLogger.error.system('Error validating content', error);

    return NextResponse.json(
      {
        success: false,
        valid: false,
        error: 'Failed to validate content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
