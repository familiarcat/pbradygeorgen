import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * API route to check content freshness
 */
export async function GET(request: NextRequest) {
  try {
    HesseLogger.summary.start('Checking content freshness');

    // Get the current PDF fingerprint
    const currentFingerprint = await getCurrentPdfFingerprint();

    // Get the stored fingerprint from the content state
    const contentState = await getContentState();
    const storedFingerprint = contentState.fingerprint;
    const lastUpdated = contentState.lastUpdated;

    // Check if the content is processed and analyzed
    const isProcessed = contentState.isProcessed;
    const isAnalyzed = contentState.isAnalyzed;

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

    return NextResponse.json({
      success: true,
      isStale,
      reason,
      currentFingerprint,
      storedFingerprint,
      lastUpdated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking content freshness:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check content freshness',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
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
 * Get the content state
 */
async function getContentState(): Promise<{
  lastUpdated: Date;
  fingerprint: string;
  isProcessed: boolean;
  isAnalyzed: boolean;
  pdfPath: string;
  pdfSize: number;
  pdfLastModified: Date;
}> {
  try {
    // Path to the content state file
    const stateFilePath = path.join(process.cwd(), 'public', 'extracted', 'content_state.json');

    // Check if the file exists
    if (fs.existsSync(stateFilePath)) {
      const stateJson = fs.readFileSync(stateFilePath, 'utf8');
      const state = JSON.parse(stateJson);

      // Convert string dates back to Date objects
      state.lastUpdated = new Date(state.lastUpdated);
      state.pdfLastModified = new Date(state.pdfLastModified);

      return state;
    }

    // If the file doesn't exist, return a default state
    return {
      lastUpdated: new Date(0),
      fingerprint: '',
      isProcessed: false,
      isAnalyzed: false,
      pdfPath: '',
      pdfSize: 0,
      pdfLastModified: new Date(0)
    };
  } catch (error) {
    console.error('Error getting content state:', error);

    // Return a default state
    return {
      lastUpdated: new Date(0),
      fingerprint: '',
      isProcessed: false,
      isAnalyzed: false,
      pdfPath: '',
      pdfSize: 0,
      pdfLastModified: new Date(0)
    };
  }
}
