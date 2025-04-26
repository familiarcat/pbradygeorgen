'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { checkAndRefreshPdfContent } from '@/app/actions';
import { DanteLogger } from '@/utils/DanteLogger';

// Create a loading component
function Loading() {
  // Match the header background color
  const headerBgColor = 'rgba(212, 209, 190, 0.95)'; // Ecru background with transparency

  return (
    <div className="flex justify-center items-center min-h-screen w-full" style={{ backgroundColor: headerBgColor }}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-[#A05A35] border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-[#49423D] text-lg font-medium">Loading PDF viewer...</p>
      </div>
    </div>
  );
}

// Dynamically import the simple PDF viewer component with no SSR
const SimplePDFViewer = dynamic(() => import('@/components/SimplePDFViewer'), {
  ssr: false,
  loading: Loading,
});

export default function PDFViewerWrapper() {
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

  // Check if PDF content needs to be refreshed on page load
  useEffect(() => {
    async function refreshIfNeeded() {
      try {
        setIsRefreshing(true);
        const result = await checkAndRefreshPdfContent();

        if (result.refreshed) {
          // If content was refreshed, update the timestamp to trigger a re-render
          setRefreshTimestamp(result.timestamp);
          console.log('PDF content refreshed automatically:', result.message);
        } else {
          console.log('PDF content check:', result.message);
        }
      } catch (error) {
        console.error('Error checking PDF content:', error);
        DanteLogger.error.system('Error in automatic PDF refresh', { error });
      } finally {
        setIsRefreshing(false);
      }
    }

    refreshIfNeeded();
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<Loading />}>
        {isRefreshing ? (
          <Loading />
        ) : (
          <SimplePDFViewer key={refreshTimestamp} />
        )}
      </Suspense>
    </div>
  );
}
