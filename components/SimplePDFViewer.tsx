'use client';

import { useState, useEffect, useRef } from 'react';
import PDFAnalyzer from './PDFAnalyzer';
import DynamicThemeProvider from './DynamicThemeProvider';
import SalingerHeader from './SalingerHeader';
// import UploadModal from './UploadModal'; // Temporarily disabled
import { DanteLogger } from '@/utils/DanteLogger';

export default function SimplePDFViewer() {
  // Generate a timestamp for cache-busting
  const timestamp = Date.now();

  // PDF URL state with cache-busting query parameter
  const [pdfUrl, setPdfUrl] = useState(`/pbradygeorgen_resume.pdf?v=${timestamp}`);
  const [pdfName, setPdfName] = useState('pbradygeorgen_resume');
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

  // Upload modal state - temporarily disabled
  // const [showUploadModal, setShowUploadModal] = useState(false);

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
  }, [pdfLoaded]);

  // Handle download action
  const handleDownload = () => {
    // Create a link to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'pbradygeorgen_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle view summary action
  const handleViewSummary = () => {
    setShowAnalyzer(true);
  };

  // Handle contact action
  const handleContact = () => {
    // For now, just open a mailto link
    window.location.href = 'mailto:brady@pbradygeorgen.com';
  };

  // Handle upload action - temporarily disabled
  const handleUpload = () => {
    // Upload functionality temporarily disabled
    console.log('Upload functionality temporarily disabled');
    DanteLogger.warn.deprecated('Upload functionality temporarily disabled');
  };

  // Handle PDF uploaded - temporarily disabled
  const handlePdfUploaded = (url: string, fileName: string) => {
    // Upload functionality temporarily disabled
    console.log('Upload functionality temporarily disabled');
  };

  // Handle refresh action - force reload the default PDF
  const handleRefresh = async () => {
    try {
      // Show loading state
      setPdfVisible(false);
      setPdfLoaded(false);

      // Call the API to refresh the default PDF content
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('useDefault', 'true');
          return formData;
        })(),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh PDF content');
      }

      const data = await response.json();

      if (data.success) {
        // Update the PDF URL with a cache-busting query parameter
        setPdfUrl(`/pbradygeorgen_resume.pdf?v=${Date.now()}`);
        DanteLogger.success.basic('PDF content refreshed successfully');

        // Reload the iframe to force a refresh
        if (iframeRef.current) {
          iframeRef.current.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
        }
      } else {
        throw new Error(data.error || 'Unknown error refreshing PDF content');
      }
    } catch (error) {
      console.error('Error refreshing PDF content:', error);
      DanteLogger.error.system('Error refreshing PDF content', { error });

      // Show PDF again even if refresh failed
      setPdfVisible(true);
    }
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
          onRefresh={handleRefresh}
          fileName={pdfName}
        />

        {/* Upload Modal - temporarily disabled
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onPdfUploaded={handlePdfUploaded}
        />
        */}

        {/* No overlay - we'll use window event listeners instead */}
        {/* Loading indicator - shown until PDF is loaded */}
        {!pdfVisible && (
          <div className="absolute inset-0 flex justify-center items-center z-20 bg-[var(--bg-primary)]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-[var(--cta-primary)] border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-primary)] text-lg font-medium">Loading resume...</p>
            </div>
          </div>
        )}

        {/* PDF Analyzer - positioned on the left side */}
        {showAnalyzer && (
          <div className="absolute top-4 left-4 z-20 w-[32rem] max-w-[90vw]">
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
            title="Resume PDF"
          />
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
