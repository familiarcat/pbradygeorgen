import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { DanteLogger } from './DanteLogger';

const execAsync = promisify(exec);

/**
 * Get the last modified time of the default PDF file
 * @returns The last modified time as a Date object
 */
export function getPdfLastModifiedTime(): Date | null {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    const stats = fs.statSync(pdfPath);
    return stats.mtime;
  } catch (error) {
    console.error('Error getting PDF last modified time:', error);
    return null;
  }
}

/**
 * Get the last modified time of the extracted content
 * @returns The last modified time as a Date object
 */
export function getExtractedContentLastModifiedTime(): Date | null {
  try {
    const extractedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');
    if (!fs.existsSync(extractedPath)) {
      return null;
    }
    const stats = fs.statSync(extractedPath);
    return stats.mtime;
  } catch (error) {
    console.error('Error getting extracted content last modified time:', error);
    return null;
  }
}

/**
 * Check if the PDF content needs to be refreshed
 * @returns True if the PDF is newer than the extracted content, false otherwise
 */
export function isPdfContentStale(): boolean {
  const pdfTime = getPdfLastModifiedTime();
  const extractedTime = getExtractedContentLastModifiedTime();

  if (!pdfTime) {
    return false; // Can't determine PDF time, assume it's not stale
  }

  if (!extractedTime) {
    return true; // No extracted content, need to extract
  }

  // Compare timestamps - if PDF is newer, content is stale
  return pdfTime > extractedTime;
}

/**
 * Refresh the PDF content by extracting it again
 * @returns A promise that resolves when the extraction is complete
 */
export async function refreshPdfContent(): Promise<boolean> {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // Run the extraction script
    await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);
    DanteLogger.success.core('PDF content refreshed automatically');

    return true;
  } catch (error) {
    console.error('Error refreshing PDF content:', error);
    DanteLogger.error.system('Error refreshing PDF content', { error });
    return false;
  }
}
