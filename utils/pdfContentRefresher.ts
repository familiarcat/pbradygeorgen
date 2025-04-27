/**
 * PDF Content Refresher
 *
 * This utility ensures that we're always using fresh content from the current PDF file.
 * It provides functions to check if content is stale and to force refresh the content.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from './DanteLogger';

const execAsync = promisify(exec);

interface ContentTimestamps {
  pdfTimestamp: number;
  extractedTimestamp: number;
  isStale: boolean;
}

/**
 * Check if the extracted content is stale compared to the PDF file
 * @returns Object with timestamps and stale status
 */
export async function checkContentFreshness(): Promise<ContentTimestamps> {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    const extractedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

    // Check if files exist
    if (!fs.existsSync(pdfPath)) {
      DanteLogger.error.dataFlow('PDF file not found');
      return {
        pdfTimestamp: 0,
        extractedTimestamp: 0,
        isStale: true
      };
    }

    if (!fs.existsSync(extractedPath)) {
      DanteLogger.warn.deprecated('Extracted content not found');
      return {
        pdfTimestamp: fs.statSync(pdfPath).mtimeMs,
        extractedTimestamp: 0,
        isStale: true
      };
    }

    // Get file timestamps
    const pdfStats = fs.statSync(pdfPath);
    const extractedStats = fs.statSync(extractedPath);

    // Check if PDF is newer than extracted content
    const isStale = pdfStats.mtimeMs > extractedStats.mtimeMs;

    if (isStale) {
      DanteLogger.warn.deprecated('PDF content is stale, needs refresh');
    } else {
      DanteLogger.success.basic('PDF content is fresh');
    }

    return {
      pdfTimestamp: pdfStats.mtimeMs,
      extractedTimestamp: extractedStats.mtimeMs,
      isStale
    };
  } catch (error) {
    DanteLogger.error.dataFlow(`Error checking content freshness: ${error}`);
    return {
      pdfTimestamp: 0,
      extractedTimestamp: 0,
      isStale: true
    };
  }
}

/**
 * Force refresh the extracted content from the PDF file
 * @returns Promise that resolves when the refresh is complete
 */
export async function forceRefreshContent(): Promise<boolean> {
  try {
    DanteLogger.success.basic('PDF content is stale, refreshing...');

    // Run the extract-pdf-text-improved.js script
    const scriptPath = path.join(process.cwd(), 'scripts', 'extract-pdf-text-improved.js');
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Execute the script with the PDF path
    const { stdout, stderr } = await execAsync(`node ${scriptPath} ${pdfPath}`);

    if (stderr) {
      DanteLogger.error.dataFlow(`Error refreshing content: ${stderr}`);
      return false;
    }

    DanteLogger.success.core('PDF content refreshed automatically');
    return true;
  } catch (error) {
    DanteLogger.error.dataFlow(`Error refreshing content: ${error}`);
    return false;
  }
}

/**
 * Get the extracted content from the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns The extracted content
 */
export async function getExtractedContent(forceRefresh = false): Promise<string> {
  try {
    // Check if content is stale
    const { isStale } = await checkContentFreshness();

    // Force refresh if needed
    if (isStale || forceRefresh) {
      await forceRefreshContent();
    }

    // Read the extracted content
    const extractedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

    if (!fs.existsSync(extractedPath)) {
      DanteLogger.error.dataFlow('Extracted content not found after refresh');
      return '';
    }

    // Read the content
    const content = fs.readFileSync(extractedPath, 'utf8');
    return content;
  } catch (error) {
    DanteLogger.error.dataFlow(`Error getting extracted content: ${error}`);
    return '';
  }
}

export default {
  checkContentFreshness,
  forceRefreshContent,
  getExtractedContent
};
