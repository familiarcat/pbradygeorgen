"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const PreviewModal_module_css_1 = __importDefault(require("@/styles/PreviewModal.module.css"));
const DanteLogger_1 = require("@/utils/DanteLogger");
const DynamicThemeProvider_1 = require("@/components/DynamicThemeProvider");
const StyledMarkdown_1 = __importDefault(require("./StyledMarkdown"));
const PreviewModal = ({ isOpen, onClose, content, format, fileName, onDownload, onDownloadWithDataUrl, position = 'center', pdfSource = '/pbradygeorgen_resume.pdf', // Default to resume PDF
pdfDataUrl // Optional PDF data URL
 }) => {
    const modalRef = (0, react_1.useRef)(null);
    const markdownRef = (0, react_1.useRef)(null);
    const textRef = (0, react_1.useRef)(null);
    // Access the PDF theme context to use extracted styles
    const themeContext = (0, DynamicThemeProvider_1.usePdfThemeContext)();
    // Removed PDF export functionality as we're standardizing the UI across all preview modals
    // Handle click outside to close
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    // Handle escape key to close
    (0, react_1.useEffect)(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);
    // Prevent scrolling when modal is open
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className={PreviewModal_module_css_1.default.modalOverlay}>
      <div ref={modalRef} className={`${PreviewModal_module_css_1.default.modalContent} ${position === 'left'
            ? PreviewModal_module_css_1.default.modalContentLeft
            : position === 'right'
                ? PreviewModal_module_css_1.default.modalContentRight
                : ''}`} style={{
            // Apply PDF-extracted styles
            backgroundColor: 'var(--bg-primary, #ffffff)',
            color: 'var(--text-color, #333333)',
            borderColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
        }}>
        <div className={PreviewModal_module_css_1.default.modalHeader} style={{
            backgroundColor: 'var(--bg-secondary, #f5f5f5)',
            borderBottomColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
        }}>
          <h2 className={PreviewModal_module_css_1.default.modalTitle} style={{
            color: 'var(--text-color, #333333)',
            fontFamily: 'var(--font-heading, sans-serif)'
        }}>
            {format === 'markdown'
            ? 'Markdown Preview'
            : format === 'pdf'
                ? 'PDF Preview'
                : 'Text Preview'}
          </h2>
          <div className={PreviewModal_module_css_1.default.headerActions}>
            {/* Removed Export PDF button to maintain consistent UI across all preview modals */}
            <button className={PreviewModal_module_css_1.default.closeButton} onClick={onClose} aria-label="Close" style={{
            color: 'var(--text-color, #333333)'
        }}>
              &times;
            </button>
          </div>
        </div>
        <div className={PreviewModal_module_css_1.default.modalBody} style={{
            backgroundColor: 'var(--bg-tertiary, #f9f9f9)'
        }}>
          {format === 'markdown' ? (<div ref={markdownRef} className={PreviewModal_module_css_1.default.markdownPreview} style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-color, #333333)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))',
                fontFamily: 'var(--font-body, serif)'
            }}>
              <StyledMarkdown_1.default>{content}</StyledMarkdown_1.default>
            </div>) : format === 'pdf' ? (<div className={PreviewModal_module_css_1.default.pdfPreview} style={{
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))'
            }}>
              {/* Log preview details */}
              {(() => {
                console.log('Rendering PDF preview with:', {
                    hasPdfDataUrl: !!pdfDataUrl,
                    pdfSource,
                    format,
                    fileName
                });
                return null;
            })()}

              {/* Conditionally render based on whether we have a data URL or a file source */}
              {pdfDataUrl ? (<iframe src={pdfDataUrl} className={PreviewModal_module_css_1.default.pdfFrame} title="PDF Preview (Data URL)"/>) : (<iframe src={`${pdfSource}?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className={PreviewModal_module_css_1.default.pdfFrame} title="PDF Preview (File)"/>)}
            </div>) : (<pre ref={textRef} className={PreviewModal_module_css_1.default.textPreview} style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-color, #333333)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))',
                fontFamily: 'var(--font-mono, monospace)'
            }}>{content}</pre>)}
        </div>
        <div className={PreviewModal_module_css_1.default.modalFooter} style={{
            borderTopColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
        }}>
          <button className={PreviewModal_module_css_1.default.downloadButton} style={{
            backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))',
            color: 'var(--text-color, #333333)',
            fontFamily: 'var(--font-button, sans-serif)'
        }} onClick={async (e) => {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event propagation
            // EXTREME DEBUGGING - Log everything
            console.log('==================== DOWNLOAD BUTTON CLICKED ====================');
            console.log('Format:', format);
            console.log('File Name:', fileName);
            console.log('Has PDF Data URL:', !!pdfDataUrl);
            console.log('Has Data URL Handler:', !!onDownloadWithDataUrl);
            console.log('Has Download Handler:', !!onDownload);
            console.log('PDF Source:', pdfSource);
            console.log('Component Props:', { format, fileName, pdfDataUrl: pdfDataUrl ? 'exists' : 'none', onDownloadWithDataUrl: !!onDownloadWithDataUrl, onDownload: !!onDownload });
            try {
                DanteLogger_1.DanteLogger.success.basic(`Starting download of ${fileName}.${format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'}`);
                // DO NOT CLOSE THE MODAL YET - We'll handle this after download
                let downloadStarted = false;
                // For PDF format with data URL - DIRECT DOWNLOAD APPROACH
                if (format === 'pdf' && pdfDataUrl) {
                    console.log('DOWNLOAD STRATEGY: Using direct data URL download');
                    try {
                        // Create a direct download link
                        const link = document.createElement('a');
                        link.href = pdfDataUrl;
                        link.download = `${fileName}.pdf`;
                        document.body.appendChild(link);
                        // Force the download to happen synchronously
                        console.log('Triggering direct download from data URL');
                        link.click();
                        document.body.removeChild(link);
                        downloadStarted = true;
                        console.log('Direct download from data URL completed');
                    }
                    catch (directError) {
                        console.error('Direct download failed:', directError);
                        // If direct download fails, try the handler
                        if (onDownloadWithDataUrl) {
                            console.log('Falling back to data URL handler');
                            try {
                                await onDownloadWithDataUrl(pdfDataUrl);
                                downloadStarted = true;
                                console.log('Data URL handler download completed');
                            }
                            catch (handlerError) {
                                console.error('Handler download failed:', handlerError);
                                throw handlerError; // Re-throw to be caught by outer try/catch
                            }
                        }
                    }
                }
                // For PDF format without data URL but with source
                else if (format === 'pdf' && !pdfDataUrl && pdfSource) {
                    console.log('DOWNLOAD STRATEGY: Using source file download');
                    try {
                        // Create a direct download link for the source
                        const link = document.createElement('a');
                        link.href = pdfSource;
                        link.download = `${fileName}.pdf`;
                        document.body.appendChild(link);
                        console.log('Triggering direct download from source');
                        link.click();
                        document.body.removeChild(link);
                        downloadStarted = true;
                        console.log('Direct download from source completed');
                    }
                    catch (directError) {
                        console.error('Direct source download failed:', directError);
                        // If direct download fails, try the handler
                        console.log('Falling back to default handler');
                        try {
                            await onDownload();
                            downloadStarted = true;
                            console.log('Default handler download completed');
                        }
                        catch (handlerError) {
                            console.error('Handler download failed:', handlerError);
                            throw handlerError; // Re-throw to be caught by outer try/catch
                        }
                    }
                }
                // For all other formats (markdown, text)
                else {
                    console.log('DOWNLOAD STRATEGY: Using format-specific handler');
                    try {
                        console.log(`Calling handler for ${format} format`);
                        await onDownload();
                        downloadStarted = true;
                        console.log('Format handler download completed');
                    }
                    catch (handlerError) {
                        console.error(`${format} handler download failed:`, handlerError);
                        throw handlerError; // Re-throw to be caught by outer try/catch
                    }
                }
                // Log success if download started
                if (downloadStarted) {
                    console.log('Download successfully initiated');
                    DanteLogger_1.DanteLogger.success.ux(`Downloaded ${fileName}.${format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'}`);
                    // Only close the modal after a longer delay to ensure download starts
                    console.log('Setting timeout to close modal');
                    setTimeout(() => {
                        console.log('Closing modal after download');
                        onClose();
                    }, 2000); // Even longer delay for more reliable downloads
                }
                else {
                    console.error('No download method succeeded');
                    throw new Error('No download method succeeded');
                }
            }
            catch (error) {
                console.error('Error during download process:', error);
                DanteLogger_1.DanteLogger.error.runtime(`Download failed: ${error}`);
                alert('There was an error downloading the file. Please try again.');
            }
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" className={PreviewModal_module_css_1.default.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download {format === 'markdown'
            ? 'Markdown'
            : format === 'pdf'
                ? 'PDF'
                : 'Text'} File
          </button>
          <button className={PreviewModal_module_css_1.default.cancelButton} onClick={onClose} style={{
            backgroundColor: 'var(--cta-tertiary-bg, rgba(126, 98, 51, 0.1))',
            color: 'var(--text-color, #333333)',
            borderColor: 'var(--border-color, rgba(73, 66, 61, 0.2))',
            fontFamily: 'var(--font-button, sans-serif)'
        }}>
            Close
          </button>
        </div>
      </div>
    </div>);
};
exports.default = PreviewModal;
//# sourceMappingURL=PreviewModal.js.map