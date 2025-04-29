import { getAnalyzedContent } from '@/utils/pdfContentProcessor';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * Server component that gets the analyzed PDF content
 * This component is used to fetch the analyzed content during SSR
 */
export async function getAnalyzedPdfContent(forceRefresh: boolean = false) {
  try {
    // Get the analyzed content
    const analyzedContent = await getAnalyzedContent(forceRefresh);
    
    return {
      success: true,
      data: analyzedContent
    };
  } catch (error) {
    DanteLogger.error.system('Error getting analyzed PDF content', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export default async function AnalyzedPdfContent() {
  // Get the analyzed content
  const result = await getAnalyzedPdfContent();
  
  // This component doesn't render anything, it's just used to fetch the data during SSR
  return null;
}
