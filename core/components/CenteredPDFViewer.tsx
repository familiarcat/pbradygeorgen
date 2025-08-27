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

  // Calculate dynamic width based on screen size with absolute min/max constraints
  const calculatePdfWidth = () => {
    // Get the window width
    const windowWidth = window.innerWidth;

    // Define absolute min and max widths in pixels
    const MIN_WIDTH_PX = 320; // Minimum width in pixels
    const MAX_WIDTH_PX = 1000; // Maximum width in pixels

    // Calculate width as percentage of window width
    // Base percentage: Min width: 70%, Max width: 90%
    const widthPercent = Math.min(Math.max(70, 90 - (windowWidth / 100)), 90);

    // Calculate the pixel width based on percentage
    const calculatedWidth = (windowWidth * widthPercent) / 100;

    // Apply absolute constraints
    if (calculatedWidth < MIN_WIDTH_PX && windowWidth > MIN_WIDTH_PX) {
      // If calculated width is too small but window can fit minimum width
      return `${MIN_WIDTH_PX}px`;
    } else if (calculatedWidth > MAX_WIDTH_PX) {
      // If calculated width is too large
      return `${MAX_WIDTH_PX}px`;
    } else if (windowWidth <= MIN_WIDTH_PX) {
      // For very small screens, use 100% width
      return '100%';
    } else {
      // Otherwise use the percentage
      return `${widthPercent}%`;
    }
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

  // Use the CSS variable for background color instead of hardcoding
  const headerBgColor = 'var(--bg-primary, #d4d1be)'; // Use extracted background color with fallback

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

    // Function to check if device is in portrait mode
    const isPortraitMode = () => {
      return window.innerHeight > window.innerWidth;
    };

    // Function to check if device is mobile
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Function to apply background color to all relevant elements
    const applyBackgroundColor = () => {
      // Get the computed background color from CSS variables
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--bg-primary').trim() || '#d4d1be';

      // Set background color on body and html to match the extracted background
      document.body.style.backgroundColor = bgColor;
      document.documentElement.style.backgroundColor = bgColor;

      // Target any potential container elements that might show through
      const containers = document.querySelectorAll('.pdf-container, .pdf-iframe, iframe');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.backgroundColor = bgColor;
        }
      });

      // Create a full-height background element if it doesn't exist
      if (!document.getElementById('full-height-background')) {
        const backgroundEl = document.createElement('div');
        backgroundEl.id = 'full-height-background';
        backgroundEl.style.position = 'fixed';
        backgroundEl.style.top = '0';
        backgroundEl.style.left = '0';
        backgroundEl.style.width = '100%';
        backgroundEl.style.height = '100%';
        backgroundEl.style.backgroundColor = bgColor;
        backgroundEl.style.zIndex = '-1';
        document.body.appendChild(backgroundEl);
      } else {
        const backgroundEl = document.getElementById('full-height-background');
        if (backgroundEl) {
          backgroundEl.style.backgroundColor = bgColor;
        }
      }

      // Special handling for mobile portrait mode
      if (isMobileDevice() && isPortraitMode()) {
        // Add an extra div at the bottom of the body to extend the background
        if (!document.getElementById('portrait-mode-extension')) {
          const extensionEl = document.createElement('div');
          extensionEl.id = 'portrait-mode-extension';
          extensionEl.style.position = 'fixed';
          extensionEl.style.bottom = '0';
          extensionEl.style.left = '0';
          extensionEl.style.width = '100%';
          extensionEl.style.height = '100vh'; // Extra height to ensure coverage
          extensionEl.style.backgroundColor = bgColor;
          extensionEl.style.zIndex = '-2'; // Below the main background
          document.body.appendChild(extensionEl);
        }
      } else {
        // Remove the extension if not in portrait mode
        const extensionEl = document.getElementById('portrait-mode-extension');
        if (extensionEl) {
          document.body.removeChild(extensionEl);
        }
      }
    };

    // Initial set
    setVH();
    applyBackgroundColor();

    // Handle orientation change specifically
    const handleOrientationChange = () => {
      // Delay to ensure the browser has updated its dimensions
      setTimeout(() => {
        setVH();
        applyBackgroundColor();

        // Additional delay for iOS Safari which sometimes needs extra time
        setTimeout(() => {
          // Apply background color again after a longer delay
          applyBackgroundColor();

          // Force a small scroll to trigger a repaint in problematic browsers
          window.scrollTo(0, 1);
          setTimeout(() => window.scrollTo(0, 0), 10);
        }, 300);
      }, 100);
    };

    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', handleOrientationChange);

      // Clean up the background elements
      const backgroundEl = document.getElementById('full-height-background');
      if (backgroundEl) {
        document.body.removeChild(backgroundEl);
      }

      // Clean up the portrait mode extension
      const extensionEl = document.getElementById('portrait-mode-extension');
      if (extensionEl) {
        document.body.removeChild(extensionEl);
      }

      // Reset body and html background colors
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div
        className="relative w-full min-h-screen h-full overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--bg-primary, #d4d1be)', // Use CSS variable with fallback
          minHeight: 'calc(var(--vh, 1vh) * 100)'
        }}
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
          <div className="absolute inset-0 flex justify-center items-center z-20" style={{ backgroundColor: 'var(--bg-primary, #d4d1be)' }}>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-[var(--primary)] border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-color)] text-lg font-medium">Loading PDF...</p>
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
            backgroundColor: 'var(--bg-primary, #d4d1be)', // Use CSS variable with fallback
            opacity: pdfVisible ? 1 : 0,
            transform: pdfVisible ? 'scale(1)' : 'scale(0.98)',
            height: `calc(var(--vh, 1vh) * 100 - ${headerHeight})`, // Use custom vh for mobile
            minHeight: `calc(var(--vh, 1vh) * 100 - ${headerHeight})`, // Ensure minimum height
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            flex: 1
          }}
        >
          {/* PDF Viewer - centered horizontally with responsive width and proper margins */}
          <div
            className="mx-auto rounded-lg overflow-hidden shadow-lg flex-grow pdf-container"
            style={{
              backgroundColor: 'var(--bg-primary, #d4d1be)', // Use CSS variable with fallback
              width: pdfWidth,
              maxWidth: '1000px', // Maximum width constraint
              minWidth: '320px', // Minimum width constraint
              height: '100%',
              minHeight: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              // Add a subtle border using CSS variable
              border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))',
              // Center the container
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              className="w-full h-full flex-grow pdf-iframe"
              style={{
                border: 'none',
                backgroundColor: 'var(--bg-primary, #d4d1be)', // Use CSS variable with fallback
                margin: 0,
                padding: 0,
                display: 'block', // Ensures proper rendering in all browsers
                minHeight: '100%',
                flex: 1,
                position: 'relative',
                // Ensure the iframe content is properly scaled
                width: '100%',
                height: '100%'
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
