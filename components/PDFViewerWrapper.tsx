'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Create a loading component
function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full" style={{ backgroundColor: '#D4D1BE' }}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-amber-800 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-amber-900 text-lg font-medium">Loading PDF viewer...</p>
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
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<Loading />}>
        <SimplePDFViewer />
      </Suspense>
    </div>
  );
}
