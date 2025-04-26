'use client';

import { useState, useEffect, useRef } from 'react';
import PDFAnalyzer from './PDFAnalyzer';
import DynamicThemeProvider from './DynamicThemeProvider';
import SalingerHeader from './SalingerHeader';
import UploadModal from './UploadModal';
import { DanteLogger } from '@/utils/DanteLogger';

interface CenteredPDFViewerProps {
  pdfUrl: string;
  pdfName: string;
}

export default function CenteredPDFViewer({ pdfUrl, pdfName }: CenteredPDFViewerProps) {
  const showControls = false;
  const [showUI, setShowUI] = useState(false);
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

  // Extract base file name without extension
  const baseFileName = pdfName.replace(/\.[^/.]+$/, "");

  // Handle PDF load event
  const handlePdfLoad = () => {
    DanteLogger.success.ux('PDF loaded successfully');
    setPdfLoaded(true);

    // Sequence of animations for a smooth introduction
    if (!initialAnimationComplete) {
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
  };

  // Handle download action
  const handleDownload = () => {
    DanteLogger.success.ux('Download button clicked');
    // Download functionality is handled in the SalingerHeader component
  };

  // Handle view summary action
  const handleViewSummary = () => {
    setShowAnalyzer(true);
    DanteLogger.success.ux('Summary view opened');
  };

  // Handle contact action
  const handleContact = () => {
    DanteLogger.success.ux('Contact button clicked');
    // Open email client with mailto link
    window.location.href = 'mailto:brady@pbradygeorgen.com?subject=Website%20Contact';
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

  // Calculate dynamic width based on screen size
  const calculatePdfWidth = () => {
    // Get the window width
    const windowWidth = window.innerWidth;

    // Calculate width as percentage of window width
    // Min width: 70%, Max width: 90%
    const widthPercent = Math.min(Math.max(70, 90 - (windowWidth / 100)), 90);

    return `${widthPercent}%`;
  };

  // State for dynamic width
  const [pdfWidth, setPdfWidth] = useState('80%');

  // Calculate header height (based on SalingerHeader CSS)
  // Default height is padding-top + padding-bottom + content height
  // 1.25rem + 1.875rem + ~2rem = ~5rem for desktop
  // 1rem + 1.25rem + ~3rem = ~5.25rem for mobile (due to stacking)
  const getHeaderHeight = () => {
    // For mobile devices, we need to account for the browser UI elements
    if (window.innerWidth <= 768) {
      // On very small screens, header takes more space due to wrapping
      if (window.innerWidth < 480) {
        return '6.5rem';
      }
      return '5.25rem';
    }
    return '5rem';
  };

  // State for header height
  const [headerHeight, setHeaderHeight] = useState('5rem');

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setPdfWidth(calculatePdfWidth());
      setHeaderHeight(getHeaderHeight());
    };

    // Set initial dimensions
    setPdfWidth(calculatePdfWidth());
    setHeaderHeight(getHeaderHeight());

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fix for mobile viewport height issues (iOS Safari, etc.)
  useEffect(() => {
    // Function to update CSS variable with the viewport height
    const setVH = () => {
      // First get the viewport height and multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial set
    setVH();

    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Get the header background color from CSS
  const headerBgColor = 'rgba(212, 209, 190, 0.95)'; // Ecru background with transparency

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div
        className="relative w-full h-screen overflow-hidden flex flex-col"
        style={{ backgroundColor: headerBgColor }}
      >
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
          <div className="absolute inset-0 flex justify-center items-center z-20" style={{ backgroundColor: headerBgColor }}>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-[var(--cta-primary)] border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-primary)] text-lg font-medium">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* PDF Analyzer - positioned on the left side */}
        {showAnalyzer && (
          <div className="absolute top-4 left-4 z-20 w-[32rem] max-w-[90vw]">
            <PDFAnalyzer onClose={() => setShowAnalyzer(false)} />
          </div>
        )}

        {/* PDF Viewer Container - takes remaining vertical space */}
        <div
          className="flex-grow flex flex-col overflow-hidden transition-all duration-1500 ease-in-out"
          style={{
            backgroundColor: headerBgColor,
            opacity: pdfVisible ? 1 : 0,
            transform: pdfVisible ? 'scale(1)' : 'scale(0.98)',
            height: `calc(var(--vh, 1vh) * 100 - ${headerHeight})`, // Use custom vh for mobile
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem'
          }}
        >
          {/* PDF Viewer - centered horizontally with responsive width */}
          <div
            className="mx-auto rounded-lg overflow-hidden shadow-lg flex-grow"
            style={{
              backgroundColor: 'var(--pdf-background)',
              width: pdfWidth,
              maxHeight: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              className="w-full h-full"
              style={{
                border: 'none',
                backgroundColor: 'var(--pdf-background)',
                margin: 0,
                padding: 0,
                display: 'block', // Ensures proper rendering in all browsers
                minHeight: '100%'
              }}
              title="PDF Viewer"
              onLoad={handlePdfLoad}
            />
          </div>
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
