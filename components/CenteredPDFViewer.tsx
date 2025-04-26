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
    // Contact functionality is handled in the SalingerHeader component
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

  // Calculate dynamic padding based on screen width
  const calculatePadding = () => {
    // Get the window width
    const windowWidth = window.innerWidth;
    
    // Base padding is 5% of window width on each side
    let sidePadding = Math.max(windowWidth * 0.05, 20); // Minimum 20px
    
    // For larger screens, increase padding proportionally
    if (windowWidth > 1200) {
      sidePadding = Math.max(windowWidth * 0.1, 60); // 10% padding with minimum 60px
    } else if (windowWidth > 768) {
      sidePadding = Math.max(windowWidth * 0.075, 40); // 7.5% padding with minimum 40px
    }
    
    return `${sidePadding}px`;
  };

  // State for dynamic padding
  const [sidePadding, setSidePadding] = useState('5%');
  
  // Update padding on window resize
  useEffect(() => {
    const handleResize = () => {
      setSidePadding(calculatePadding());
    };
    
    // Set initial padding
    setSidePadding(calculatePadding());
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get the header background color from CSS
  const headerBgColor = 'rgba(212, 209, 190, 0.95)'; // Ecru background with transparency

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div 
        className="relative w-full min-h-screen overflow-hidden flex flex-col" 
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

        {/* Centered PDF Viewer using iframe */}
        <div
          className="flex-grow flex justify-center items-center transition-all duration-1500 ease-in-out"
          style={{
            backgroundColor: headerBgColor,
            padding: `2rem ${sidePadding}`,
            opacity: pdfVisible ? 1 : 0,
            transform: pdfVisible ? 'scale(1)' : 'scale(0.98)'
          }}
        >
          <div 
            className="w-full h-full max-w-5xl rounded-lg overflow-hidden shadow-lg"
            style={{ 
              backgroundColor: 'var(--pdf-background)',
              maxHeight: 'calc(100vh - 4rem - 4rem)' // Subtract header height and padding
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full"
              style={{
                border: 'none',
                backgroundColor: 'var(--pdf-background)',
                margin: 0,
                padding: 0
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
