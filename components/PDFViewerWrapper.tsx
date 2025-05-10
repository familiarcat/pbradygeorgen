'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import ColorPalettePreview from './ColorPalettePreview';
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
    // Use a flag to prevent multiple refreshes
    let isRefreshingContent = false;

    async function refreshIfNeeded() {
      // If already refreshing, don't start another refresh
      if (isRefreshingContent) return;

      try {
        isRefreshingContent = true;
        setIsRefreshing(true);

        // Add a check to prevent excessive refreshes
        const lastRefreshKey = 'lastPdfContentRefresh';
        const lastRefresh = localStorage.getItem(lastRefreshKey);
        const now = Date.now();

        // Only refresh if it's been more than 5 minutes since the last refresh
        if (!lastRefresh || (now - parseInt(lastRefresh)) > 5 * 60 * 1000) {
          console.log('PDF content check: Checking if refresh is needed');
          const result = await checkAndRefreshPdfContent();

          if (result.refreshed) {
            // If content was refreshed, update the timestamp to trigger a re-render
            setRefreshTimestamp(result.timestamp);
            console.log('PDF content refreshed automatically:', result.message);
            // Store the refresh time
            localStorage.setItem(lastRefreshKey, now.toString());
          } else {
            console.log('PDF content check:', result.message);
          }
        } else {
          console.log('PDF content check: Skipped (refreshed recently)');
          DanteLogger.success.core('PDF content refreshed recently, skipping check');
        }
      } catch (error) {
        console.error('Error checking PDF content:', error);
        DanteLogger.error.system('Error in automatic PDF refresh', { error });
      } finally {
        setIsRefreshing(false);
        isRefreshingContent = false;
      }
    }

    refreshIfNeeded();

    // Cleanup function
    return () => {
      isRefreshingContent = true; // Prevent any pending refreshes
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      {/* Color Palette Preview - Only visible in admin mode */}
      <ColorPalettePreview />

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
