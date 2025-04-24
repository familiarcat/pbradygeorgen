'use server';

import { isPdfContentStale, refreshPdfContent } from '@/utils/pdfUtils';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * Server action to check if the PDF content needs to be refreshed and refresh it if necessary
 * @returns An object with the refresh status and timestamp
 */
export async function checkAndRefreshPdfContent() {
  try {
    const isStale = isPdfContentStale();

    if (isStale) {
      DanteLogger.success.basic('PDF content is stale, refreshing...');
      const success = await refreshPdfContent();

      return {
        refreshed: success,
        timestamp: Date.now(),
        message: success ? 'PDF content refreshed successfully' : 'Failed to refresh PDF content'
      };
    } else {
      DanteLogger.success.basic('PDF content is up to date');
      return {
        refreshed: false,
        timestamp: Date.now(),
        message: 'PDF content is already up to date'
      };
    }
  } catch (error) {
    console.error('Error in checkAndRefreshPdfContent:', error);
    DanteLogger.error.system('Error checking/refreshing PDF content', { error });

    return {
      refreshed: false,
      timestamp: Date.now(),
      message: 'Error checking/refreshing PDF content',
      error: String(error)
    };
  }
}
