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
const SummaryModal_module_css_1 = __importDefault(require("@/styles/SummaryModal.module.css"));
const DanteLogger_1 = require("@/utils/DanteLogger");
const HesseLogger_1 = require("@/utils/HesseLogger");
const PdfGenerator_1 = __importDefault(require("@/utils/PdfGenerator"));
const PreviewModal_1 = __importDefault(require("./PreviewModal"));
const DynamicThemeProvider_1 = require("@/components/DynamicThemeProvider");
const StyledMarkdown_1 = __importDefault(require("./StyledMarkdown"));
const SummaryModal = ({ isOpen, onClose, content, position = 'left', isLoading = false, 
// Introduction download handlers
onPdfPreview, onPdfDownload, onMarkdownPreview, onMarkdownDownload, onTextPreview, onTextDownload }) => {
    const modalRef = (0, react_1.useRef)(null);
    const contentRef = (0, react_1.useRef)(null);
    // Access the PDF theme context to use extracted styles
    // This ensures the context is initialized even if we don't directly use it
    (0, DynamicThemeProvider_1.usePdfThemeContext)();
    // State to track if PDF styles are loaded
    const [pdfStylesLoaded, setPdfStylesLoaded] = (0, react_1.useState)(false);
    // Check if PDF styles are loaded
    (0, react_1.useEffect)(() => {
        const checkPdfStylesLoaded = () => {
            const stylesLoaded = document.documentElement.getAttribute('data-pdf-styles-loaded') === 'true';
            setPdfStylesLoaded(stylesLoaded);
            if (stylesLoaded) {
                DanteLogger_1.DanteLogger.success.basic('SummaryModal: PDF styles detected and will be applied');
            }
            else {
                DanteLogger_1.DanteLogger.error.runtime('SummaryModal: PDF styles not detected, using fallbacks');
            }
        };
        // Check immediately
        checkPdfStylesLoaded();
        // Also listen for the custom event when styles are loaded
        const handleStylesLoaded = () => {
            DanteLogger_1.DanteLogger.success.basic('SummaryModal: PDF styles loaded event received');
            setPdfStylesLoaded(true);
        };
        document.addEventListener('pdf-styles-loaded', handleStylesLoaded);
        return () => {
            document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
        };
    }, []);
    // States for download operations
    const [isGeneratingPdf, setIsGeneratingPdf] = (0, react_1.useState)(false);
    const [isGeneratingMd, setIsGeneratingMd] = (0, react_1.useState)(false);
    const [isGeneratingTxt, setIsGeneratingTxt] = (0, react_1.useState)(false);
    // States for preview modals
    // Track which preview is active to prevent multiple previews from showing simultaneously
    const [activePreview, setActivePreview] = (0, react_1.useState)(null);
    const [previewContent, setPreviewContent] = (0, react_1.useState)('');
    const [pdfDataUrl, setPdfDataUrl] = (0, react_1.useState)(null);
    // Computed states for previews based on activePreview
    const showPdfPreview = activePreview === 'pdf';
    const showMdPreview = activePreview === 'markdown';
    const showTxtPreview = activePreview === 'text';
    // State for dropdown
    const [showDownloadOptions, setShowDownloadOptions] = (0, react_1.useState)(false);
    // Function to handle PDF export
    const handleExportToPdf = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                setIsGeneratingPdf(true);
                HesseLogger_1.HesseLogger.summary.start('Exporting summary as PDF with PDF-extracted styles');
                // Define consistent options for both preview and download
                // Use PDF-extracted styles for the Introduction
                const pdfOptions = {
                    title: 'P. Brady Georgen - Introduction',
                    fileName: 'pbradygeorgen_introduction.pdf',
                    headerText: 'P. Brady Georgen - Introduction',
                    footerText: 'Generated with Salinger Design',
                    pageSize: 'letter', // Explicitly type as literal 'letter'
                    margins: { top: 8, right: 8, bottom: 8, left: 8 },
                    // Don't force dark theme, use PDF-extracted styles instead
                    isDarkTheme: false
                };
                // If we have a cached PDF data URL from the preview, use it for consistency
                if (pdfDataUrl) {
                    DanteLogger_1.DanteLogger.success.basic('Using cached PDF data URL for download');
                    // Use the downloadFromDataUrl function
                    await downloadFromDataUrl(pdfDataUrl);
                }
                else {
                    // Generate a new PDF if we don't have a cached data URL
                    DanteLogger_1.DanteLogger.success.basic('Generating new PDF data URL for download');
                    // First generate a data URL to ensure consistency with preview
                    const dataUrl = await PdfGenerator_1.default.generatePdfDataUrlFromMarkdown(content, pdfOptions);
                    // Cache the data URL for future use
                    setPdfDataUrl(dataUrl);
                    // Use the downloadFromDataUrl function
                    await downloadFromDataUrl(dataUrl);
                }
                DanteLogger_1.DanteLogger.success.basic('Exported introduction as PDF using PDF-extracted styles');
                HesseLogger_1.HesseLogger.summary.complete('Introduction exported as PDF with PDF-extracted styles');
                resolve();
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
                HesseLogger_1.HesseLogger.summary.error(`PDF export failed: ${error}`);
                alert('There was an error generating the PDF. Please try again.');
                reject(error);
            }
            finally {
                setIsGeneratingPdf(false);
            }
        });
    };
    // Function to handle PDF preview
    const handlePdfPreview = async () => {
        try {
            HesseLogger_1.HesseLogger.summary.start('Generating PDF preview with PDF-extracted styles');
            console.log('Starting PDF preview generation for Introduction');
            // Define consistent options for both preview and download - same as in export function
            // Use PDF-extracted styles for the Introduction
            const pdfOptions = {
                title: 'P. Brady Georgen - Introduction',
                fileName: 'pbradygeorgen_introduction.pdf',
                headerText: 'P. Brady Georgen - Introduction',
                footerText: 'Generated with Salinger Design',
                pageSize: 'letter', // Explicitly type as literal 'letter'
                margins: { top: 8, right: 8, bottom: 8, left: 8 },
                // Don't force dark theme, use PDF-extracted styles instead
                isDarkTheme: false
            };
            // Generate a real-time PDF preview optimized for a single page
            const dataUrl = await PdfGenerator_1.default.generatePdfDataUrlFromMarkdown(content, pdfOptions);
            console.log('PDF data URL generated:', dataUrl ? `${dataUrl.substring(0, 50)}...` : 'null');
            // Store the data URL for the preview
            setPdfDataUrl(dataUrl);
            console.log('PDF data URL stored in state');
            // Show the preview modal
            setActivePreview('pdf');
            console.log('Active preview set to PDF');
            DanteLogger_1.DanteLogger.success.basic('Opened PDF preview with PDF-extracted styles');
            HesseLogger_1.HesseLogger.summary.complete('PDF preview generated with PDF-extracted styles');
        }
        catch (error) {
            console.error('Error in PDF preview generation:', error);
            DanteLogger_1.DanteLogger.error.runtime(`Error showing PDF preview: ${error}`);
            HesseLogger_1.HesseLogger.summary.error(`PDF preview failed: ${error}`);
            alert('There was an error generating the PDF preview. Please try again.');
        }
    };
    // Function to handle downloading from a PDF data URL
    // This is used when downloading from a cached PDF data URL
    const downloadFromDataUrl = (dataUrl) => {
        return new Promise((resolve, reject) => {
            try {
                DanteLogger_1.DanteLogger.success.basic('Downloading PDF from data URL');
                // Create a link to download the PDF from the data URL
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'pbradygeorgen_introduction.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                DanteLogger_1.DanteLogger.success.basic('Downloaded PDF from preview data URL');
                resolve();
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.runtime(`Error downloading PDF from data URL: ${error}`);
                alert('There was an error downloading the PDF. Please try again.');
                reject(error);
            }
        });
    };
    // Use the downloadFromDataUrl function in handleExportToPdf
    (0, react_1.useEffect)(() => {
        if (pdfStylesLoaded) {
            DanteLogger_1.DanteLogger.success.basic('PDF styles loaded, updating PDF generation options');
        }
    }, [pdfStylesLoaded]);
    // Function to handle Markdown export
    const handleExportToMarkdown = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                setIsGeneratingMd(true);
                HesseLogger_1.HesseLogger.summary.start('Exporting summary as Markdown');
                // Create and download the file
                const blob = new Blob([content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pbradygeorgen_introduction.md';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                DanteLogger_1.DanteLogger.success.basic('Exported summary as Markdown');
                HesseLogger_1.HesseLogger.summary.complete('Summary exported as Markdown');
                resolve();
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.runtime(`Error exporting to Markdown: ${error}`);
                HesseLogger_1.HesseLogger.summary.error(`Error exporting to Markdown: ${error}`);
                alert('There was an error generating the Markdown file. Please try again.');
                reject(error);
            }
            finally {
                setIsGeneratingMd(false);
            }
        });
    };
    // Function to handle Markdown preview
    const handleMarkdownPreview = async () => {
        try {
            HesseLogger_1.HesseLogger.summary.start('Opening Markdown preview');
            setPreviewContent(content);
            setActivePreview('markdown');
            DanteLogger_1.DanteLogger.success.basic('Opened Markdown preview with Salinger design');
        }
        catch (error) {
            DanteLogger_1.DanteLogger.error.runtime(`Error showing Markdown preview: ${error}`);
            HesseLogger_1.HesseLogger.summary.error(`Markdown preview failed: ${error}`);
            alert('There was an error generating the Markdown preview. Please try again.');
        }
    };
    // Function to handle Text export
    const handleExportToText = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                setIsGeneratingTxt(true);
                HesseLogger_1.HesseLogger.summary.start('Exporting summary as Text');
                // Convert markdown to plain text by removing markdown syntax
                const plainText = content
                    .replace(/#{1,6}\s+/g, '') // Remove headers
                    .replace(/\*\*/g, '') // Remove bold
                    .replace(/\*/g, '') // Remove italic
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
                    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
                    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
                    .replace(/>/g, '') // Remove blockquotes
                    .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
                // Create and download the file
                const blob = new Blob([plainText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pbradygeorgen_introduction.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                DanteLogger_1.DanteLogger.success.basic('Exported summary as Text');
                HesseLogger_1.HesseLogger.summary.complete('Summary exported as Text');
                resolve();
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.runtime(`Error exporting to Text: ${error}`);
                HesseLogger_1.HesseLogger.summary.error(`Error exporting to Text: ${error}`);
                alert('There was an error generating the Text file. Please try again.');
                reject(error);
            }
            finally {
                setIsGeneratingTxt(false);
            }
        });
    };
    // Function to handle Text preview
    const handleTextPreview = async () => {
        try {
            HesseLogger_1.HesseLogger.summary.start('Opening Text preview');
            // Convert markdown to plain text
            const plainText = content
                .replace(/#{1,6}\s+/g, '') // Remove headers
                .replace(/\*\*/g, '') // Remove bold
                .replace(/\*/g, '') // Remove italic
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
                .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
                .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
                .replace(/>/g, '') // Remove blockquotes
                .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
            setPreviewContent(plainText);
            setActivePreview('text');
            DanteLogger_1.DanteLogger.success.basic('Opened Text preview with Salinger design');
        }
        catch (error) {
            DanteLogger_1.DanteLogger.error.runtime(`Error showing Text preview: ${error}`);
            HesseLogger_1.HesseLogger.summary.error(`Text preview failed: ${error}`);
            alert('There was an error generating the Text preview. Please try again.');
        }
    };
    // Handle click outside to close modal or dropdown
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            // Close the modal if clicking outside
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
            // Close the dropdown if clicking outside the dropdown container
            if (showDownloadOptions) {
                const dropdownContainer = document.querySelector(`.${SummaryModal_module_css_1.default.downloadContainer}`);
                if (dropdownContainer && !dropdownContainer.contains(event.target)) {
                    setShowDownloadOptions(false);
                }
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, showDownloadOptions]);
    // Reset state when modal is closed
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            // Reset preview states when modal is closed
            setActivePreview(null);
            setPdfDataUrl(null);
            console.log('Modal closed, reset preview states');
        }
    }, [isOpen]);
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
    return (<div className={SummaryModal_module_css_1.default.modalOverlay}>
      <div ref={modalRef} className={`${SummaryModal_module_css_1.default.modalContent} ${position === 'left'
            ? SummaryModal_module_css_1.default.modalContentLeft
            : position === 'right'
                ? SummaryModal_module_css_1.default.modalContentRight
                : ''}`} style={{
            // Apply PDF-extracted styles with high specificity
            backgroundColor: 'var(--pdf-background-color, var(--bg-primary, #ffffff))' + ' !important',
            color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
            borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))' + ' !important',
            fontFamily: 'var(--pdf-body-font, var(--font-body, serif))' + ' !important'
        }} data-pdf-styles-applied={pdfStylesLoaded ? 'true' : 'false'}>
        <div className={SummaryModal_module_css_1.default.modalHeader} style={{
            backgroundColor: 'var(--pdf-background-color, var(--bg-secondary, #f5f5f5))' + ' !important',
            borderBottomColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))' + ' !important'
        }} data-pdf-styles-applied={pdfStylesLoaded ? 'true' : 'false'}>
          <h2 className={SummaryModal_module_css_1.default.modalTitle} style={{
            color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
            fontFamily: 'var(--pdf-heading-font, var(--font-heading, sans-serif))' + ' !important',
            fontWeight: 'bold'
        }} data-pdf-styles-applied={pdfStylesLoaded ? 'true' : 'false'}>Introduction</h2>
          <div className={SummaryModal_module_css_1.default.headerActions}>
            {/* Download dropdown container - Styled like SalingerHeader */}
            <div className={SummaryModal_module_css_1.default.downloadContainer}>
              <a href="#" className={SummaryModal_module_css_1.default.actionLink} onClick={(e) => e.preventDefault()} // Prevent default to allow dropdown to work
     aria-label="Download Summary" aria-haspopup="true" style={{
            backgroundColor: 'var(--pdf-primary-color, var(--cta-primary-bg, rgba(126, 78, 45, 0.1)))' + ' !important',
            color: 'var(--pdf-primary-contrast, var(--text-color, #333333))' + ' !important',
            fontFamily: 'var(--pdf-button-font, var(--font-button, sans-serif))' + ' !important',
            fontWeight: 'bold',
            border: 'none'
        }} data-pdf-styles-applied={pdfStylesLoaded ? 'true' : 'false'}>
                <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Introduction
              </a>

              {/* Dropdown menu with Salinger-inspired styling */}
              <div className={SummaryModal_module_css_1.default.downloadMenu}>
                <div className={SummaryModal_module_css_1.default.downloadOptionGroup}>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onPdfPreview) {
                onPdfPreview();
            }
            else {
                handlePdfPreview(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.previewButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onPdfDownload) {
                onPdfDownload();
            }
            else {
                handleExportToPdf(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.downloadOption}>
                    {isGeneratingPdf ? (<span className={SummaryModal_module_css_1.default.loadingText}>
                        <svg className={`${SummaryModal_module_css_1.default.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>) : (<>
                        <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        PDF Format
                      </>)}
                  </a>
                </div>

                <div className={SummaryModal_module_css_1.default.downloadOptionGroup}>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onMarkdownPreview) {
                onMarkdownPreview();
            }
            else {
                handleMarkdownPreview(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.previewButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onMarkdownDownload) {
                onMarkdownDownload();
            }
            else {
                handleExportToMarkdown(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.downloadOption}>
                    {isGeneratingMd ? (<span className={SummaryModal_module_css_1.default.loadingText}>
                        <svg className={`${SummaryModal_module_css_1.default.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>) : (<>
                        <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Markdown Format
                      </>)}
                  </a>
                </div>

                <div className={SummaryModal_module_css_1.default.downloadOptionGroup}>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onTextPreview) {
                onTextPreview();
            }
            else {
                handleTextPreview(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.previewButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a href="#" onClick={(e) => {
            e.preventDefault();
            if (onTextDownload) {
                onTextDownload();
            }
            else {
                handleExportToText(); // Fallback to internal handler
            }
        }} className={SummaryModal_module_css_1.default.downloadOption}>
                    {isGeneratingTxt ? (<span className={SummaryModal_module_css_1.default.loadingText}>
                        <svg className={`${SummaryModal_module_css_1.default.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>) : (<>
                        <svg xmlns="http://www.w3.org/2000/svg" className={SummaryModal_module_css_1.default.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Text Format
                      </>)}
                  </a>
                </div>
              </div>
            </div>

            <button className={SummaryModal_module_css_1.default.closeButton} onClick={onClose} aria-label="Close" style={{
            color: 'var(--text-color, #333333)'
        }}>
              &times;
            </button>
          </div>
        </div>
        <div className={SummaryModal_module_css_1.default.modalBody} style={{
            backgroundColor: 'var(--bg-tertiary, #f9f9f9)'
        }}>
          {isLoading ? (<div className={SummaryModal_module_css_1.default.loadingContainer} style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))'
            }}>
              <div className={SummaryModal_module_css_1.default.loadingSpinner} style={{
                color: 'var(--cta-primary, #7E4E2D)'
            }}>
                <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className={SummaryModal_module_css_1.default.loadingText} style={{
                color: 'var(--text-color, #333333)',
                fontFamily: 'var(--font-body, serif)'
            }}>Generating summary...</div>
            </div>) : (<div ref={contentRef} className={SummaryModal_module_css_1.default.markdownPreview} style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-color, #333333)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))',
                fontFamily: 'var(--font-body, serif)'
            }}>
              <StyledMarkdown_1.default>{content}</StyledMarkdown_1.default>
            </div>)}
        </div>
      </div>

      {/* Preview Modals */}
      {showPdfPreview && (<PreviewModal_1.default isOpen={showPdfPreview} onClose={() => {
                console.log('Closing PDF preview, resetting active preview');
                setActivePreview(null);
            }} content="" format="pdf" fileName="pbradygeorgen_cover_letter" onDownload={async () => {
                console.log('PDF download triggered from preview modal');
                try {
                    // Create a direct download link if we have a data URL
                    if (pdfDataUrl) {
                        console.log('Using cached PDF data URL for direct download');
                        const link = document.createElement('a');
                        link.href = pdfDataUrl;
                        link.download = 'pbradygeorgen_cover_letter.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return Promise.resolve();
                    }
                    else {
                        // Otherwise use the export function
                        return await handleExportToPdf();
                    }
                }
                catch (error) {
                    console.error('Error in PDF download from preview:', error);
                    return Promise.reject(error);
                }
            }} onDownloadWithDataUrl={async (dataUrl) => {
                console.log('PDF data URL download triggered from preview modal');
                try {
                    // Direct download approach
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'pbradygeorgen_cover_letter.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return Promise.resolve();
                }
                catch (error) {
                    console.error('Error in PDF data URL download:', error);
                    return Promise.reject(error);
                }
            }} position="right" pdfDataUrl={pdfDataUrl || undefined} // Use the dynamically generated PDF data URL
        />)}

      {showMdPreview && (<PreviewModal_1.default isOpen={showMdPreview} onClose={() => setActivePreview(null)} content={content} format="markdown" fileName="pbradygeorgen_cover_letter" onDownload={async () => {
                console.log('Markdown download triggered from preview modal');
                try {
                    // Direct download approach
                    const blob = new Blob([content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pbradygeorgen_cover_letter.md';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return Promise.resolve();
                }
                catch (error) {
                    console.error('Error in Markdown download from preview:', error);
                    return handleExportToMarkdown(); // Fall back to the handler
                }
            }} position="right"/>)}

      {showTxtPreview && (<PreviewModal_1.default isOpen={showTxtPreview} onClose={() => setActivePreview(null)} content={previewContent} format="text" fileName="pbradygeorgen_cover_letter" onDownload={async () => {
                console.log('Text download triggered from preview modal');
                try {
                    // Direct download approach
                    const blob = new Blob([previewContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pbradygeorgen_cover_letter.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return Promise.resolve();
                }
                catch (error) {
                    console.error('Error in Text download from preview:', error);
                    return handleExportToText(); // Fall back to the handler
                }
            }} position="right"/>)}
    </div>);
};
exports.default = SummaryModal;
//# sourceMappingURL=SummaryModal.js.map