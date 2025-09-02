"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PDFAnalyzer;
const react_1 = require("react");
const ContentAnalysis_1 = __importDefault(require("./ContentAnalysis"));
function PDFAnalyzer({ onClose }) {
    // State for potential error messages
    const [error] = (0, react_1.useState)(null);
    // Reference to the analyzer panel for click-outside detection
    const analyzerRef = (0, react_1.useRef)(null);
    // Handle click outside to close the analyzer
    (0, react_1.useEffect)(() => {
        function handleClickOutside(event) {
            if (analyzerRef.current && !analyzerRef.current.contains(event.target) && onClose) {
                onClose();
            }
        }
        // Handle custom close event from ContentAnalysis
        function handleCustomClose() {
            if (onClose) {
                onClose();
            }
        }
        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('close-content-analysis', handleCustomClose);
        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('close-content-analysis', handleCustomClose);
        };
    }, [onClose]);
    return (<div ref={analyzerRef} className="analyzer-panel relative">
      <div className="analyzer-header flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
        <h2 className="text-[1.5rem] font-bold m-0 text-[var(--text-primary)] tracking-tight">Summary Preview</h2>
        {onClose && (<button onClick={onClose} className="bg-transparent border-none text-[var(--text-primary)] text-[1.5rem] cursor-pointer p-[0.25rem_0.5rem] rounded transition-all duration-200 hover:bg-[rgba(90,118,130,0.1)]" aria-label="Close">
            &times;
          </button>)}
      </div>

      <div className="analyzer-content">
        {error && (<div className="mb-4 p-3 analyzer-section-content">
            {error}
          </div>)}

        {/* Content - now showing only the analysis content */}
        <div className="mt-4">
          <ContentAnalysis_1.default filePath="/extracted/resume_content_improved.md"/>

          {/* No bottom close button - using only the X icon in the upper right */}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=PDFAnalyzer.js.map