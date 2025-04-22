'use client';

import { useState, useEffect, useRef } from 'react';
import PDFAnalyzer from './PDFAnalyzer';
import DynamicThemeProvider from './DynamicThemeProvider';
import SalingerHeader from './SalingerHeader';
import UploadModal from './UploadModal';
import { DanteLogger } from '@/utils/DanteLogger';

interface PDFViewerProps {
  pdfUrl: string;
  pdfName: string;
}

export default function PDFViewer({ pdfUrl, pdfName }: PDFViewerProps) {
  const showControls = false; // Fixed value since we no longer need to toggle controls
  const [showUI, setShowUI] = useState(false); // Start with UI hidden
  const [uiTimeout, setUiTimeout] = useState<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Loading state management
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);

  // PDF analysis toggle
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Extract the base filename without extension for downloads
  const baseFileName = pdfName.replace(/\.\w+$/, '').replace(/^\d+_/, '');

  // Set up basic event listeners for UI visibility
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Simple event handlers without the intent tracker
    const handleTouch = () => {
      // For touch, always show UI briefly
      setShowUI(true);

      // Clear any existing timeout
      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }

      // Set a new timeout to hide UI after touch
      const timeout = setTimeout(() => {
        setShowUI(false);
      }, 2500);

      setUiTimeout(timeout);
    };

    // Add minimal event listeners
    window.addEventListener('touchstart', handleTouch, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('touchstart', handleTouch);

      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }
    };
  }, [uiTimeout, showUI]);

  // Keep UI visible when controls are shown
  useEffect(() => {
    if (showControls) {
      setShowUI(true);

      // Clear any auto-hide timeout
      if (uiTimeout) {
        clearTimeout(uiTimeout);
        setUiTimeout(null);
      }
    }
  }, [showControls, uiTimeout]);

  // Handle PDF loading and animation sequence
  useEffect(() => {
    // Function to handle PDF load event
    const handlePdfLoad = () => {
      // Ensure we don't trigger animations multiple times
      if (pdfLoaded) return;

      setPdfLoaded(true);
      DanteLogger.success.basic('PDF loaded successfully', { pdfUrl });

      // Start animation sequence with longer delays to ensure proper ordering

      // 1. First fade in the PDF (with a shorter delay for better responsiveness)
      setTimeout(() => {
        setPdfVisible(true);

        // 2. Then fade in the UI button after PDF is fully visible (reduced delay)
        setTimeout(() => {
          setShowUI(true);

          // 3. Finally, hide the UI and mark animation as complete
          setTimeout(() => {
            setShowUI(false);
            setInitialAnimationComplete(true);
          }, 2000); // Show button for 2 seconds initially (reduced from 3s)
        }, 1000); // Wait 1 second after PDF appears before showing button (reduced from 2s)
      }, 700); // Wait 700ms after load before showing PDF (reduced from 1s)
    };

    // Add load event listener to iframe
    const iframe = iframeRef.current;
    if (iframe) {
      // For already cached PDFs, the load event might fire immediately
      // So we need to set a timeout to ensure our animation sequence works
      iframe.addEventListener('load', handlePdfLoad);

      // Fallback in case the load event doesn't fire properly
      const fallbackTimer = setTimeout(() => {
        if (!pdfLoaded) {
          handlePdfLoad();
        }
      }, 2000); // Wait 2 seconds before assuming PDF is loaded

      return () => {
        clearTimeout(fallbackTimer);
        iframe.removeEventListener('load', handlePdfLoad);
      };
    }
  }, [pdfLoaded, pdfUrl]);

  // Handle download action
  const handleDownload = () => {
    // Create a link to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    DanteLogger.success.ux('PDF downloaded', { fileName: pdfName });
  };

  // Handle view summary action
  const handleViewSummary = () => {
    setShowAnalyzer(true);
    DanteLogger.success.ux('Summary view opened');
  };

  // Handle contact action
  const handleContact = () => {
    // For now, just open a mailto link
    window.location.href = 'mailto:brady@pbradygeorgen.com';
    DanteLogger.success.basic('Contact action triggered');
  };

  // Handle upload action
  const handleUpload = () => {
    setShowUploadModal(true);
    DanteLogger.success.ux('Upload modal opened');
  };

  // Handle PDF uploaded
  const handlePdfUploaded = (url: string, fileName: string) => {
    // Store the PDF URL in localStorage for use in the viewer
    localStorage.setItem('currentPdfUrl', url);
    localStorage.setItem('currentPdfName', fileName);

    // Reload the page to use the new PDF
    window.location.reload();
  };

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Salinger Header */}
        <SalingerHeader
          onDownload={handleDownload}
          onViewSummary={handleViewSummary}
          onContact={handleContact}
          onUpload={handleUpload}
          fileName={baseFileName}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onPdfUploaded={handlePdfUploaded}
        />

        {/* Loading indicator - shown until PDF is loaded */}
        {!pdfVisible && (
          <div className="absolute inset-0 flex justify-center items-center z-20 bg-[var(--bg-primary)]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-[var(--cta-primary)] border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-primary)] text-lg font-medium">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* PDF Analyzer */}
        {showAnalyzer && (
          <div className="absolute top-4 right-4 z-20 w-[32rem] max-w-[90vw]">
            <PDFAnalyzer onClose={() => setShowAnalyzer(false)} />
          </div>
        )}

        {/* Universal PDF Viewer using iframe */}
        <div
          className="w-full h-full pdf-container transition-all duration-1500 ease-in-out"
          style={{
            margin: 0,
            padding: 0,
            opacity: pdfVisible ? 1 : 0,
            transform: pdfVisible ? 'scale(1)' : 'scale(0.98)'
          }}
        >
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-[calc(100vh-4rem)] pdf-iframe mt-16"
            style={{
              border: 'none',
              backgroundColor: 'var(--pdf-background)',
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            title="PDF Viewer"
          />
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
