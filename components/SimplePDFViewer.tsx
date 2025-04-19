'use client';

import { useState, useEffect } from 'react';

export default function SimplePDFViewer() {
  const [showControls, setShowControls] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [uiTimeout, setUiTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide UI after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowUI(true);

      // Clear any existing timeout
      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }

      // Set a new timeout to hide the UI after 3 seconds of inactivity
      const timeout = setTimeout(() => {
        if (!showControls) { // Only auto-hide if not in controls mode
          setShowUI(false);
        }
      }, 3000);

      setUiTimeout(timeout);
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }
    };
  }, [showControls, uiTimeout]);

  // When controls are shown, ensure UI is visible and stays visible
  useEffect(() => {
    if (showControls) {
      setShowUI(true);

      // Clear any existing timeout to prevent UI from hiding
      if (uiTimeout) {
        clearTimeout(uiTimeout);
        setUiTimeout(null);
      }
    }
  }, [showControls, uiTimeout]);

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
            <a
              href="/pbradygeorgen_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 rounded-md transition-colors text-sm font-medium shadow-md"
            >
              Open in New Tab
            </a>
          </div>
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 rounded-md transition-colors text-sm font-medium shadow-md"
          >
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </button>
        </div>
      </div>

      {/* PDF Viewer - takes up the entire viewport with no margins or padding */}
      <div className="w-full h-full pdf-container" style={{ margin: 0, padding: 0 }}>
        {/* Create two separate objects - one for each mode, and toggle between them */}
        {showControls ? (
          <div className="pdf-controls-container" style={{ height: '100%', backgroundColor: '#D4D1BE' }}>
            <object
              data="/pbradygeorgen_resume.pdf#toolbar=1&navpanes=1&scrollbar=1&view=FitH"
              type="application/pdf"
              width="100%"
              height="100%"
              className="w-full h-full pdf-object pdf-with-controls"
              style={{ border: 'none', backgroundColor: '#D4D1BE', padding: 0 }}
            >
              <div className="p-8 text-center">
                <p>It appears your browser does not support embedded PDFs.</p>
                <p className="mt-4">
                  <a
                    href="/pbradygeorgen_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Click here to download the PDF
                  </a>
                </p>
              </div>
            </object>
          </div>
        ) : (
          <object
            data="/pbradygeorgen_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
            type="application/pdf"
            width="100%"
            height="100%"
            className="w-full h-full pdf-object"
            style={{ border: 'none', backgroundColor: '#D4D1BE', margin: 0, padding: 0 }}
          >
            <div className="p-8 text-center">
              <p>It appears your browser does not support embedded PDFs.</p>
              <p className="mt-4">
                <a
                  href="/pbradygeorgen_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Click here to download the PDF
                </a>
              </p>
            </div>
          </object>
        )}
      </div>
    </div>
  );
}
