'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserIntentTracker } from '@/utils/UserIntentTracker';
import PDFAnalyzer from './PDFAnalyzer';
import DynamicThemeProvider from './DynamicThemeProvider';
import SalingerHeader from './SalingerHeader';

// Define types for debug data
type CursorData = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
};

type TargetData = {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  distance: number;
  alignment: number;
  isDwelling: boolean;
  dwellDuration: number;
  dwellThreshold: number;
};

type TrajectoryData = {
  projectedX: number;
  projectedY: number;
  projectedDistance: number;
  isApproaching: boolean;
  intersectsTarget: boolean;
};

type ScoreData = {
  button: number;
  reading: number;
  exploring: number;
};

type StateData = {
  current: string;
  isSelecting: boolean;
  smallMovementCount: number;
  lastScrollTime: number;
  lastClickTime: number;
};

type DebugData = {
  viewport: { width: number; height: number };
  cursor: CursorData;
  target: TargetData;
  trajectory: TrajectoryData;
  scores: ScoreData;
  state: StateData;
};

export default function SimplePDFViewer() {
  // PDF URL for the current document
  const pdfUrl = '/pbradygeorgen_resume.pdf';
  const showControls = false; // Fixed value since we no longer need to toggle controls
  const [showUI, setShowUI] = useState(false); // Start with UI hidden
  const [uiTimeout, setUiTimeout] = useState<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Loading state management
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);

  // Debug state (set to false to hide intent tracking visualization)
  const [debugMode] = useState(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);

  // PDF analysis toggle
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  // Function to handle UI visibility - memoized to avoid dependency issues
  const handleUIVisibility = useCallback((event?: MouseEvent | TouchEvent | Event) => {
    // Don't respond to events until PDF is loaded and initial animation is complete
    if (!pdfLoaded || !initialAnimationComplete) return;

    // Track user intent through cursor position and movement
    if (event && event.type === 'mousemove') {
      const mouseEvent = event as MouseEvent;

      // Get viewport dimensions
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate the upper third of the screen
      const upperThirdHeight = viewportHeight / 3;

      // Detect if cursor is in the upper third of the screen
      const isInUpperThird = mouseEvent.clientY <= upperThirdHeight;

      // Detect cursor movement patterns
      const isMovingUp = mouseEvent.movementY < 0;
      const isMovingLeft = mouseEvent.movementX < 0;
      const cursorSpeed = Math.sqrt(Math.pow(mouseEvent.movementX, 2) + Math.pow(mouseEvent.movementY, 2));

      // Detect if cursor is in the left portion of the screen (where the button is)
      const isInLeftPortion = mouseEvent.clientX <= viewportWidth / 3;

      // Calculate a confidence score for button intent
      // Higher score = more likely the user wants to interact with the button
      let buttonIntentScore = 0;

      // Add points based on position
      if (isInUpperThird) buttonIntentScore += 3;
      if (isInLeftPortion) buttonIntentScore += 2;

      // Add points based on movement
      if (isMovingUp) buttonIntentScore += 1;
      if (isInUpperThird && isMovingLeft) buttonIntentScore += 1;

      // Reduce score if cursor is moving very fast (likely just passing through)
      if (cursorSpeed > 20) buttonIntentScore -= 1;

      // Show UI when intent score is high enough
      if (buttonIntentScore >= 3) {
        // If UI is already visible, just clear any hide timeout
        if (showUI) {
          if (uiTimeout) {
            clearTimeout(uiTimeout);
            setUiTimeout(null);
          }
        } else {
          // Otherwise show the UI with the elegant animation
          setShowUI(true);
        }
      } else if (showUI && !showControls) {
        // If cursor moves away from the button zone, start a hide timer
        // but only if we're not already in the process of hiding
        if (!uiTimeout) {
          const timeout = setTimeout(() => {
            setShowUI(false);
          }, 800); // Slightly faster hide for better responsiveness
          setUiTimeout(timeout);
        }
      }
    } else if (event && event.type === 'touchstart') {
      // For touch events, show UI
      setShowUI(true);

      // Clear any existing timeout
      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }

      // Set a new timeout to hide UI after touch
      const timeout = setTimeout(() => {
        setShowUI(false);
      }, 2500); // Slightly longer for touch to give users time to see and tap

      setUiTimeout(timeout);
    } else if (event && event.type === 'scroll') {
      // Hide UI immediately when user is scrolling (exploring content)
      setShowUI(false);

      // Clear any existing timeout
      if (uiTimeout) {
        clearTimeout(uiTimeout);
        setUiTimeout(null);
      }
    }
  }, [showControls, uiTimeout, showUI, initialAnimationComplete, pdfLoaded]);

  // Reference to the button element for position tracking
  const buttonRef = useRef<HTMLDivElement>(null);

  // Reference to the intent tracker
  const [intentTracker, setIntentTracker] = useState<ReturnType<typeof getUserIntentTracker> | null>(null);

  // Set up event listeners for UI visibility
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !intentTracker) return;

    // Set up callback for button intent changes
    intentTracker.setButtonIntentCallback((score) => {
      // No logging of intent score

      // With our gradient approach, we don't need binary thresholds
      // The button's opacity is directly tied to the intent score
      // We just need to ensure the button is in the DOM when there's any intent

      // Show the button in the DOM when there's any meaningful intent
      if (score > 3) {
        if (!showUI) {
          setShowUI(true);
        }
        // Clear any hide timeout
        if (uiTimeout) {
          clearTimeout(uiTimeout);
          setUiTimeout(null);
        }
      }
      // Only completely remove from DOM when intent is very low
      else if (score <= 3 && showUI) {
        // Use a longer timeout to ensure smooth transitions
        if (!uiTimeout) {
          const timeout = setTimeout(() => {
            setShowUI(false);
          }, 500); // Longer timeout for smoother transitions
          setUiTimeout(timeout);
        }
      }
    });

    // Event handlers for the tracker
    const handleMouseMove = (e: MouseEvent) => {

      // Track mouse movement with target element position and dimensions
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        intentTracker.trackMouseMovement(e, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        });
      } else {
        intentTracker.trackMouseMovement(e);
      }

      // Update debug data if debug mode is enabled
      if (debugMode) {
        setDebugData(intentTracker.getDebugData());
      }
    };

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

    const handleClick = (e: MouseEvent) => {
      intentTracker.trackClick(e);
      if (debugMode) {
        setDebugData(intentTracker.getDebugData());
      }
    };

    const handleScroll = (e: Event) => {
      intentTracker.trackScroll(e);
      if (debugMode) {
        setDebugData(intentTracker.getDebugData());
      }
    };

    // Reference to the iframe document for scroll events
    const iframe = iframeRef.current;
    const iframeDocument = iframe?.contentDocument || iframe?.contentWindow?.document;

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('click', handleClick);

    // Add scroll listener to both window and iframe if possible
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (iframeDocument) {
      iframeDocument.addEventListener('scroll', handleScroll, { passive: true });

      // Try to listen for mouse events in the iframe
      try {
        iframeDocument.addEventListener('mousemove', (e: MouseEvent) => {
          // Convert iframe coordinates to main document coordinates
          const rect = iframe.getBoundingClientRect();
          const adjustedEvent = new MouseEvent('mousemove', {
            clientX: e.clientX + rect.left,
            clientY: e.clientY + rect.top,
            bubbles: true,
            cancelable: true,
            view: window
          });

          // Track the movement with target element position and dimensions
          if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            intentTracker.trackMouseMovement(adjustedEvent, {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
              centerX: rect.left + rect.width / 2,
              centerY: rect.top + rect.height / 2
            });
          } else {
            intentTracker.trackMouseMovement(adjustedEvent);
          }

          // Update debug data
          if (debugMode) {
            setDebugData(intentTracker.getDebugData());
          }
        }, { passive: true });
      } catch (error) {
        console.warn('Could not attach mousemove listener to iframe:', error);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);

      if (iframeDocument) {
        iframeDocument.removeEventListener('scroll', handleScroll);
      }

      if (uiTimeout) {
        clearTimeout(uiTimeout);
      }
    };
  }, [showControls, uiTimeout, showUI, debugMode, buttonRef, handleUIVisibility, intentTracker]);

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

  // Initialize intent tracker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const tracker = getUserIntentTracker();
        setIntentTracker(tracker);

        // Initialize debug data
        if (debugMode) {
          setDebugData(tracker.getDebugData());
        }
      } catch (error) {
        console.error('Failed to initialize tracker:', error);
      }
    }
  }, [debugMode, setDebugData]);

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

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Salinger Header */}
        <SalingerHeader
          onDownload={handleDownload}
          onViewSummary={handleViewSummary}
          onContact={handleContact}
        />

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

      {/* Debug visualization - only shown when debugMode is true */}
      {debugMode && debugData && (
        <div className="absolute top-0 right-0 z-50 bg-black/80 text-white p-4 rounded-bl-lg font-mono text-xs max-w-xs">
          <h3 className="font-bold mb-2">Intent Tracking Debug</h3>

          {/* Heat map visualization */}
          <div className="mb-4 relative bg-gray-800 rounded-lg p-2 overflow-hidden">
            <div className="text-center mb-2 text-xs">Intent Gradient Field</div>

            {/* Button position indicator */}
            <div className="relative h-32 border border-gray-600 rounded bg-gray-900 overflow-hidden">
              {/* Gradient field visualization */}
              <div className="absolute inset-0 opacity-40 z-5">
                {/* We'll create a simplified visualization of the gradient field */}
                <div
                  className="absolute inset-0 bg-gradient-radial from-green-500/60 to-transparent"
                  style={{
                    left: buttonRef.current ?
                      `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().left / window.innerWidth) * 100))}%` :
                      '20%',
                    top: buttonRef.current ?
                      `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().top / window.innerHeight) * 100))}%` :
                      '20%',
                    width: '200%',
                    height: '200%',
                    opacity: 0.7,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>

              {/* Button position */}
              <div
                className="absolute w-3 h-3 bg-amber-500 rounded-full z-10"
                style={{
                  left: buttonRef.current ?
                    `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().left / window.innerWidth) * 100))}%` :
                    '20%',
                  top: buttonRef.current ?
                    `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().top / window.innerHeight) * 100))}%` :
                    '20%',
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Current intent level visualization */}
              <div
                className="absolute rounded-full bg-gradient-radial from-green-500/80 to-transparent"
                style={{
                  left: buttonRef.current ?
                    `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().left / window.innerWidth) * 100))}%` :
                    '20%',
                  top: buttonRef.current ?
                    `${Math.min(100, Math.max(0, (buttonRef.current.getBoundingClientRect().top / window.innerHeight) * 100))}%` :
                    '20%',
                  width: 100,
                  height: 100,
                  opacity: debugData.scores.button / 100,
                  transform: `translate(-50%, -50%) scale(${0.5 + (debugData.scores.button / 100)})`
                }}
              />

              {/* Cursor position */}
              <div
                className="absolute w-2 h-2 bg-white rounded-full z-20"
                style={{
                  left: `${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`,
                  top: `${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Cursor intent indicator - shows the intent level at cursor position */}
              <div
                className="absolute rounded-full bg-blue-500/30 z-15"
                style={{
                  left: `${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`,
                  top: `${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`,
                  width: '16px',
                  height: '16px',
                  opacity: debugData.scores.button / 100,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Dwell indicator */}
              {debugData.target.isDwelling && (
                <div
                  className="absolute rounded-full border-2 border-yellow-400 animate-pulse z-15"
                  style={{
                    left: `${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`,
                    top: `${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`,
                    width: '12px',
                    height: '12px',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}

              {/* Movement vector and trajectory */}
              {debugData.cursor.speed > 5 && (
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {/* Current velocity vector */}
                  <line
                    x1={`${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`}
                    y1={`${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`}
                    x2={`${Math.min(100, Math.max(0, ((debugData.cursor.x + debugData.cursor.velocityX/5) / window.innerWidth) * 100))}%`}
                    y2={`${Math.min(100, Math.max(0, ((debugData.cursor.y + debugData.cursor.velocityY/5) / window.innerHeight) * 100))}%`}
                    stroke={debugData.scores.button > 20 ? "rgba(0, 255, 0, 0.7)" : "rgba(255, 0, 0, 0.7)"}
                    strokeWidth="2"
                  />

                  {/* Projected trajectory */}
                  <line
                    x1={`${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`}
                    y1={`${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`}
                    x2={`${Math.min(100, Math.max(0, (debugData.trajectory.projectedX / window.innerWidth) * 100))}%`}
                    y2={`${Math.min(100, Math.max(0, (debugData.trajectory.projectedY / window.innerHeight) * 100))}%`}
                    stroke={debugData.trajectory.intersectsTarget ? "rgba(0, 255, 0, 0.4)" :
                           (debugData.trajectory.isApproaching ? "rgba(255, 255, 0, 0.4)" : "rgba(255, 0, 0, 0.4)")}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Line to target (showing relationship) */}
                  <line
                    x1={`${Math.min(100, Math.max(0, (debugData.cursor.x / window.innerWidth) * 100))}%`}
                    y1={`${Math.min(100, Math.max(0, (debugData.cursor.y / window.innerHeight) * 100))}%`}
                    x2={`${Math.min(100, Math.max(0, (debugData.target.centerX / window.innerWidth) * 100))}%`}
                    y2={`${Math.min(100, Math.max(0, (debugData.target.centerY / window.innerHeight) * 100))}%`}
                    stroke={"rgba(255, 255, 255, 0.2)"}
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />

                  {/* Target bounding box */}
                  <rect
                    x={`${Math.min(100, Math.max(0, (debugData.target.x / window.innerWidth) * 100))}%`}
                    y={`${Math.min(100, Math.max(0, (debugData.target.y / window.innerHeight) * 100))}%`}
                    width={`${Math.min(100, (debugData.target.width / window.innerWidth) * 100)}%`}
                    height={`${Math.min(100, (debugData.target.height / window.innerHeight) * 100)}%`}
                    stroke={"rgba(255, 255, 255, 0.3)"}
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Button Intent:</div>
            <div className="flex items-center">
              <div className="w-20 h-4 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${debugData.scores.button}%` }}
                ></div>
              </div>
              <span className="ml-2">{debugData.scores.button.toFixed(0)}</span>
            </div>

            {/* Button relationship metrics */}
            <div>Distance:</div>
            <div>{debugData.target.distance.toFixed(0)}px</div>

            <div>Alignment:</div>
            <div className="flex items-center">
              <div className="w-12 h-3 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.max(0, debugData.target.alignment) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2">{debugData.target.alignment.toFixed(2)}</span>
            </div>

            <div>Dwelling:</div>
            <div>
              {debugData.target.isDwelling ?
                <span className="text-yellow-400">{(debugData.target.dwellDuration / 1000).toFixed(1)}s</span> :
                'No'}
            </div>

            <div>Trajectory:</div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${debugData.trajectory.intersectsTarget ? 'bg-green-500' : (debugData.trajectory.isApproaching ? 'bg-yellow-500' : 'bg-red-500')}`}></div>
              <span>{debugData.trajectory.intersectsTarget ? 'Intersects' : (debugData.trajectory.isApproaching ? 'Approaching' : 'Away')}</span>
            </div>

            {/* User state */}
            <div>User State:</div>
            <div className="capitalize">{debugData.state.current}</div>

            <div>Selecting:</div>
            <div>{debugData.state.isSelecting ? 'Yes' : 'No'}</div>

            <div>Last Scroll:</div>
            <div>{(debugData.state.lastScrollTime / 1000).toFixed(1)}s ago</div>

            {/* Cursor metrics */}
            <div>Cursor X:</div>
            <div>{debugData.cursor.x}</div>

            <div>Cursor Y:</div>
            <div>{debugData.cursor.y}</div>

            <div>Velocity X:</div>
            <div>{debugData.cursor.velocityX.toFixed(2)}</div>

            <div>Velocity Y:</div>
            <div>{debugData.cursor.velocityY.toFixed(2)}</div>

            <div>Speed:</div>
            <div>{debugData.cursor.speed.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Download button positioned in the upper left corner of the PDF */}
      <div
        ref={buttonRef}
        className={`absolute top-4 left-4 z-10 transition-all duration-300 ease-out`}
        style={{
          // Direct mapping of intent score to opacity - pure gradient approach
          opacity: intentTracker ? Math.max(0, Math.min(1, intentTracker.getButtonIntentScore() / 100)) : (showUI ? 1 : 0),
          // Transform based on intent score - continuous gradient of movement
          transform: `translateY(${intentTracker ?
            `${Math.min(0, -10 + (intentTracker.getButtonIntentScore() / 10))}px` :
            (showUI ? '0' : '-10px')
          })`,
          // Subtle attraction effect - active at any intent level, proportional to score
          ...(intentTracker && debugData?.cursor && debugData?.target ? {
            marginLeft: `${Math.min(5, Math.max(-5, ((debugData.cursor.x - debugData.target.centerX) / 100) * (intentTracker.getButtonIntentScore() / 100)))}px`,
            marginTop: `${Math.min(3, Math.max(-3, ((debugData.cursor.y - debugData.target.centerY) / 100) * (intentTracker.getButtonIntentScore() / 100)))}px`
          } : {})
        }}
      >
        <div className="flex flex-col space-y-2">
          <a
            href="/pbradygeorgen_resume.pdf"
            download
            className="analyzer-button analyzer-button-primary px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Download Resume
          </a>

          <button
            onClick={() => setShowAnalyzer(!showAnalyzer)}
            className="analyzer-button analyzer-button-secondary px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {showAnalyzer ? 'Hide Contact' : 'Contact'}
          </button>
        </div>
      </div>

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
          src="/pbradygeorgen_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
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
