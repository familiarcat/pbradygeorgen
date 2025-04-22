'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

// Dynamically import the PDF viewer component with no SSR
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: Loading,
});

export default function DynamicPDFViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get the PDF URL from localStorage
      const storedPdfUrl = localStorage.getItem('currentPdfUrl');
      const storedPdfName = localStorage.getItem('currentPdfName');
      
      if (storedPdfUrl) {
        setPdfUrl(storedPdfUrl);
        setPdfName(storedPdfName);
      } else {
        // If no PDF URL is found, redirect to the upload page
        router.push('/upload');
      }
    }
  }, [router]);

  // If no PDF URL is available yet, show loading
  if (!pdfUrl) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<Loading />}>
        <PDFViewer pdfUrl={pdfUrl} pdfName={pdfName || 'document.pdf'} />
      </Suspense>
    </div>
  );
}
