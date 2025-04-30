import { NextRequest, NextResponse } from 'next/server';
import { ContentStateService } from '@/utils/ContentStateService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Check if the PDF content is stale
 */
async function checkContentFreshness(contentStateService: any): Promise<{
  isStale: boolean;
  reason?: string;
  currentFingerprint?: string;
  storedFingerprint?: string;
  lastUpdated?: Date;
}> {
  try {
    HesseLogger.summary.start('Checking content freshness');

    // Get the current PDF fingerprint
    const currentFingerprint = await getCurrentPdfFingerprint();

    // Get the stored fingerprint from the content state
    const storedFingerprint = contentStateService.getFingerprint();
    const lastUpdated = contentStateService.getState().lastUpdated;

    // Check if the content is processed and analyzed
    const isProcessed = contentStateService.isContentProcessed();
    const isAnalyzed = contentStateService.isContentAnalyzed();

    // Determine if the content is stale
    const isStale = currentFingerprint !== storedFingerprint || !isProcessed || !isAnalyzed;

    // Determine the reason
    let reason: string | undefined;
    if (currentFingerprint !== storedFingerprint) {
      reason = 'PDF content has changed';
      console.warn('PDF content has changed, refresh needed');
    } else if (!isProcessed) {
      reason = 'Content has not been processed';
      console.warn('Content has not been processed, processing needed');
    } else if (!isAnalyzed) {
      reason = 'Content has not been analyzed';
      console.warn('Content has not been analyzed, analysis needed');
    }

    if (isStale) {
      HesseLogger.summary.progress('Content is stale and needs refresh');
    } else {
      HesseLogger.summary.progress('Content is fresh and up-to-date');
    }

    return {
      isStale,
      reason,
      currentFingerprint,
      storedFingerprint,
      lastUpdated
    };
  } catch (error) {
    console.error('Error checking content freshness:', error);

    // If there's an error, assume the content is stale to be safe
    return {
      isStale: true,
      reason: `Error checking freshness: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Get the current PDF fingerprint
 */
async function getCurrentPdfFingerprint(): Promise<string> {
  try {
    // Use the default resume path
    const filePath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at ${filePath}`);
    }

    // Read the file
    const pdfBuffer = fs.readFileSync(filePath);

    // Generate the fingerprint
    const hash = crypto.createHash('sha256');
    hash.update(pdfBuffer);
    const fingerprint = hash.digest('hex');

    return fingerprint;
  } catch (error) {
    console.error('Error getting current PDF fingerprint:', error);
    throw error;
  }
}

/**
 * API route to get the current content state
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Getting content state');

    // Get the content state service
    const contentStateService = ContentStateService.getInstance();

    // Get the current state
    const state = contentStateService.getState();

    // Check if the content is stale
    const freshnessResult = await checkContentFreshness(contentStateService);

    HesseLogger.summary.complete('Content state retrieved successfully');

    // Return the content state
    return NextResponse.json({
      success: true,
      state,
      freshness: freshnessResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting content state:', error);
    HesseLogger.summary.error(`Error getting content state: ${error}`);
    DanteLogger.error.system('Error getting content state', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get content state',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
