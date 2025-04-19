'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function SimplePDFViewer() {
  const showControls = false; // Fixed value since we no longer need to toggle controls
  const [showUI, setShowUI] = useState(true);
  const [uiTimeout, setUiTimeout] = useState<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to handle UI visibility - memoized to avoid dependency issues
  const handleUIVisibility = useCallback((event?: MouseEvent) => {
    // For mouse events, only show UI when cursor is near the top of the screen
    if (event && event.type === 'mousemove') {
      // Only show UI when cursor is within 100px of the top of the screen
      if (event.clientY <= 100) {
        setShowUI(true);
      } else if (showUI && !showControls) {
        // If cursor moves away from the top and controls aren't shown, hide UI faster
        if (uiTimeout) {
          clearTimeout(uiTimeout);
        }
        const timeout = setTimeout(() => {
          setShowUI(false);
        }, 1000); // Faster hide (1 second)
        setUiTimeout(timeout);
        return;
      }
    } else {
      // For non-mouse events (touch, click, or initial load), always show UI
      setShowUI(true);
    }

    // Clear any existing timeout
    if (uiTimeout) {
      clearTimeout(uiTimeout);
    }

    // Only set auto-hide timeout if controls are not shown
    if (!showControls) {
      const timeout = setTimeout(() => {
        setShowUI(false);
      }, 2000); // Reduced from 3000ms to 2000ms for faster hiding

      setUiTimeout(timeout);
    }
  }, [showControls, uiTimeout, showUI]);

  // Set up event listeners for UI visibility
  useEffect(() => {
    // Event handlers that pass the event to handleUIVisibility
    const handleMouseMove = (e: MouseEvent) => handleUIVisibility(e);
    const handleTouch = () => handleUIVisibility();
    const handleClick = () => handleUIVisibility();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('click', handleClick);

    // Show UI initially
    handleUIVisibility();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);

      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }
    };
  }, [showControls, handleUIVisibility, uiTimeout]);

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

  // No toggle controls needed anymore

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#D4D1BE' }}>
      {/* Floating Controls - only visible on hover or when controls are active */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)' }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-2">
            <a
              href="/pbradygeorgen_resume.pdf"
              download
              className="px-4 py-2 bg-amber-800 text-white hover:bg-amber-900 rounded-md transition-colors text-sm font-medium shadow-md"
            >
              Download Resume
            </a>
          </div>

        </div>
      </div>

      {/* Universal PDF Viewer using iframe */}
      <div className="w-full h-full pdf-container" style={{ margin: 0, padding: 0 }}>
        <iframe
          ref={iframeRef}
          src="/pbradygeorgen_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
          className="w-full h-full pdf-iframe"
          style={{
            border: 'none',
            backgroundColor: '#D4D1BE',
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
  );
}
