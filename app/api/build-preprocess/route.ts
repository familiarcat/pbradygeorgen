import { NextRequest, NextResponse } from 'next/server';
import { processPdf } from '@/utils/pdfContentProcessor';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to pre-process the PDF content during build time
 * This is called during the build process to ensure the content is ready
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Pre-processing PDF content during build');
    
    // Path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    
    // Process the PDF
    const result = await processPdf(pdfPath, true);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    HesseLogger.summary.complete('PDF content pre-processed successfully during build');
    
    // Return success
    return NextResponse.json({
      success: true,
      message: 'PDF content pre-processed successfully during build',
      timestamp: new Date().toISOString(),
      contentFingerprint: result.contentFingerprint
    });
  } catch (error) {
    console.error('Error pre-processing PDF content during build:', error);
    HesseLogger.summary.error(`Error pre-processing PDF content during build: ${error}`);
    DanteLogger.error.system('Error pre-processing PDF content during build', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to pre-process PDF content during build',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
