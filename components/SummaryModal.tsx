'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SummaryModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import ReactMarkdown from 'react-markdown';
import PdfGenerator from '@/utils/PdfGenerator';
import PreviewModal from './PreviewModal';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  position?: 'left' | 'right' | 'center';
  isLoading?: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  content,
  position = 'left',
  isLoading = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // States for download operations
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMd, setIsGeneratingMd] = useState(false);
  const [isGeneratingTxt, setIsGeneratingTxt] = useState(false);

  // States for preview modals
  // Track which preview is active to prevent multiple previews from showing simultaneously
  const [activePreview, setActivePreview] = useState<'pdf' | 'markdown' | 'text' | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  // Computed states for previews based on activePreview
  const showPdfPreview = activePreview === 'pdf';
  const showMdPreview = activePreview === 'markdown';
  const showTxtPreview = activePreview === 'text';

  // State for dropdown
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Function to handle PDF export
  const handleExportToPdf = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingPdf(true);
        HesseLogger.summary.start('Exporting summary as PDF with dark theme');

        // If we have a cached PDF data URL from the preview, use it for consistency
        if (pdfDataUrl) {
          DanteLogger.success.basic('Using cached PDF data URL for download');

          // Create a link to download the PDF from the data URL
          const link = document.createElement('a');
          link.href = pdfDataUrl;
          link.download = 'pbradygeorgen_cover_letter.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Generate a new PDF if we don't have a cached data URL
          DanteLogger.success.basic('Generating new PDF for download');

          // Use the markdown content directly with dark theme styling
          // Note the different file name to distinguish it from the resume PDF
          await PdfGenerator.generatePdfFromMarkdown(content, {
            title: 'P. Brady Georgen - Cover Letter',
            fileName: 'pbradygeorgen_cover_letter.pdf',
            headerText: 'P. Brady Georgen - Cover Letter',
            footerText: 'Generated with Salinger Design',
            // Use letter size for US standard 8.5 x 11 inches
            pageSize: 'letter',
            // Use smaller margins to fit more content on a single page
            margins: {
              top: 8,
              right: 8,
              bottom: 8,
              left: 8
            }
          });
        }

        DanteLogger.success.ux('Exported cover letter as PDF using Salinger dark theme');
        HesseLogger.summary.complete('Cover letter exported as PDF with dark theme styling');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
        HesseLogger.summary.error(`PDF export failed: ${error}`);
        alert('There was an error generating the PDF. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingPdf(false);
      }
    });
  };

  // Function to handle PDF preview
  const handlePdfPreview = async () => {
    try {
      HesseLogger.summary.start('Generating PDF preview with dark theme');
      console.log('Starting PDF preview generation for Cover Letter');

      // Generate a real-time PDF preview optimized for a single page
      const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, {
        title: 'P. Brady Georgen - Cover Letter',
        fileName: 'pbradygeorgen_cover_letter.pdf',
        headerText: 'P. Brady Georgen - Cover Letter',
        footerText: 'Generated with Salinger Design',
        // Use letter size for US standard 8.5 x 11 inches
        pageSize: 'letter',
        // Use smaller margins to fit more content on a single page
        margins: {
          top: 8,
          right: 8,
          bottom: 8,
          left: 8
        }
      });

      console.log('PDF data URL generated:', dataUrl ? `${dataUrl.substring(0, 50)}...` : 'null');

      // Store the data URL for the preview
      setPdfDataUrl(dataUrl);
      console.log('PDF data URL stored in state');

      // Show the preview modal
      setActivePreview('pdf');
      console.log('Active preview set to PDF');

      DanteLogger.success.ux('Opened PDF preview with Salinger dark theme');
      HesseLogger.summary.complete('PDF preview generated with dark theme styling');
    } catch (error) {
      console.error('Error in PDF preview generation:', error);
      DanteLogger.error.runtime(`Error showing PDF preview: ${error}`);
      HesseLogger.summary.error(`PDF preview failed: ${error}`);
      alert('There was an error generating the PDF preview. Please try again.');
    }
  };

  // Function to handle downloading from a PDF data URL
  const handleDownloadFromDataUrl = (dataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        DanteLogger.success.basic('Downloading PDF from data URL');

        // Create a link to download the PDF from the data URL
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'pbradygeorgen_cover_letter.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DanteLogger.success.ux('Downloaded PDF from preview data URL');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading PDF from data URL: ${error}`);
        alert('There was an error downloading the PDF. Please try again.');
        reject(error);
      }
    });
  };

  // Function to handle Markdown export
  const handleExportToMarkdown = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingMd(true);
        HesseLogger.summary.start('Exporting summary as Markdown');

        // Create and download the file
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pbradygeorgen_cover_letter.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux('Exported summary as Markdown');
        HesseLogger.summary.complete('Summary exported as Markdown');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to Markdown: ${error}`);
        HesseLogger.summary.error(`Error exporting to Markdown: ${error}`);
        alert('There was an error generating the Markdown file. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingMd(false);
      }
    });
  };

  // Function to handle Markdown preview
  const handleMarkdownPreview = async () => {
    try {
      HesseLogger.summary.start('Opening Markdown preview');
      setPreviewContent(content);
      setActivePreview('markdown');
      DanteLogger.success.ux('Opened Markdown preview with Salinger design');
    } catch (error) {
      DanteLogger.error.runtime(`Error showing Markdown preview: ${error}`);
      HesseLogger.summary.error(`Markdown preview failed: ${error}`);
      alert('There was an error generating the Markdown preview. Please try again.');
    }
  };

  // Function to handle Text export
  const handleExportToText = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingTxt(true);
        HesseLogger.summary.start('Exporting summary as Text');

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
        a.download = 'pbradygeorgen_cover_letter.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux('Exported summary as Text');
        HesseLogger.summary.complete('Summary exported as Text');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to Text: ${error}`);
        HesseLogger.summary.error(`Error exporting to Text: ${error}`);
        alert('There was an error generating the Text file. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingTxt(false);
      }
    });
  };

  // Function to handle Text preview
  const handleTextPreview = async () => {
    try {
      HesseLogger.summary.start('Opening Text preview');

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
      DanteLogger.success.ux('Opened Text preview with Salinger design');
    } catch (error) {
      DanteLogger.error.runtime(`Error showing Text preview: ${error}`);
      HesseLogger.summary.error(`Text preview failed: ${error}`);
      alert('There was an error generating the Text preview. Please try again.');
    }
  };

  // Handle click outside to close modal or dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the modal if clicking outside
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }

      // Close the dropdown if clicking outside the dropdown container
      if (showDownloadOptions) {
        const dropdownContainer = document.querySelector(`.${styles.downloadContainer}`);
        if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
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
  useEffect(() => {
    if (!isOpen) {
      // Reset preview states when modal is closed
      setActivePreview(null);
      setPdfDataUrl(null);
      console.log('Modal closed, reset preview states');
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${
          position === 'left'
            ? styles.modalContentLeft
            : position === 'right'
              ? styles.modalContentRight
              : ''
        }`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cover Letter</h2>
          <div className={styles.headerActions}>
            {/* Download dropdown container - Styled like SalingerHeader */}
            <div className={styles.downloadContainer}>
              <a
                href="#"
                className={styles.actionLink}
                onClick={(e) => e.preventDefault()} // Prevent default to allow dropdown to work
                aria-label="Download Summary"
                aria-haspopup="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Cover Letter
              </a>

              {/* Dropdown menu with Salinger-inspired styling */}
              <div className={styles.downloadMenu}>
                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePdfPreview();
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExportToPdf();
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingPdf ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        PDF Format
                      </>
                    )}
                  </a>
                </div>

                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMarkdownPreview();
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExportToMarkdown();
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingMd ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Markdown Format
                      </>
                    )}
                  </a>
                </div>

                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTextPreview();
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExportToText();
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingTxt ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Text Format
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>

            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className={styles.loadingText}>Generating summary...</div>
            </div>
          ) : (
            <div ref={contentRef} className={styles.markdownPreview}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modals */}
      {showPdfPreview && (
        <PreviewModal
          isOpen={showPdfPreview}
          onClose={() => {
            console.log('Closing PDF preview, resetting active preview');
            setActivePreview(null);
          }}
          content=""
          format="pdf"
          fileName="pbradygeorgen_cover_letter"
          onDownload={handleExportToPdf}
          onDownloadWithDataUrl={handleDownloadFromDataUrl} // Use the data URL download handler
          position="right"
          pdfDataUrl={pdfDataUrl || undefined} // Use the dynamically generated PDF data URL
        />
      )}

      {showMdPreview && (
        <PreviewModal
          isOpen={showMdPreview}
          onClose={() => setActivePreview(null)}
          content={content}
          format="markdown"
          fileName="pbradygeorgen_cover_letter"
          onDownload={handleExportToMarkdown}
          position="right"
        />
      )}

      {showTxtPreview && (
        <PreviewModal
          isOpen={showTxtPreview}
          onClose={() => setActivePreview(null)}
          content={previewContent}
          format="text"
          fileName="pbradygeorgen_cover_letter"
          onDownload={handleExportToText}
          position="right"
        />
      )}
    </div>
  );
};

export default SummaryModal;
