'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Create a loading component
function Loading() {
  return <div className="flex justify-center items-center min-h-screen">Loading PDF viewer...</div>;
}

// Dynamically import the simple PDF viewer component with no SSR
const SimplePDFViewer = dynamic(() => import('@/components/SimplePDFViewer'), {
  ssr: false,
  loading: Loading,
});

export default function PDFViewerWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <SimplePDFViewer />
    </Suspense>
  );
}
