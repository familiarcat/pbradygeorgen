'use client';

import React, { useEffect, useRef } from 'react';
import styles from '@/styles/PreviewModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import { usePdfThemeContext } from '@/components/DynamicThemeProvider';
import StyledMarkdown from './StyledMarkdown';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  format: 'markdown' | 'text' | 'pdf' | 'docx';
  fileName: string;
  onDownload: () => void; // Default download handler
  onDownloadWithDataUrl?: (dataUrl: string) => void; // Optional handler for downloading with data URL
  position?: 'left' | 'right' | 'center';
  pdfSource?: string; // Optional PDF source for preview (file path)
  pdfDataUrl?: string; // Optional PDF data URL for preview (takes precedence over pdfSource)
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  format,
  fileName,
  onDownload,
  onDownloadWithDataUrl,
  position = 'center',
  pdfSource = '/pbradygeorgen_resume.pdf', // Default to resume PDF
  pdfDataUrl // Optional PDF data URL
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLPreElement>(null);

  // Access the PDF theme context to use extracted styles
  const themeContext = usePdfThemeContext();

  // Removed PDF export functionality as we're standardizing the UI across all preview modals

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
        }`}
        style={{
          // Apply PDF-extracted styles
          backgroundColor: 'var(--pdf-background-color, var(--bg-primary, #ffffff))',
          color: 'var(--pdf-text-color, var(--text-color, #333333))',
          borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))',
          fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, "Helvetica Neue", Arial, sans-serif)))'
        }}>
        <div
          className={styles.modalHeader}
          style={{
            backgroundColor: 'var(--pdf-secondary-color, var(--bg-secondary, #f5f5f5))',
            borderBottomColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))'
          }}>
          <h2
            className={styles.modalTitle}
            style={{
              color: 'var(--pdf-text-color, var(--text-color, #333333))',
              fontFamily: 'var(--pdf-heading-font, var(--font-heading, var(--dynamic-heading-font, "Helvetica Neue", Arial, sans-serif)))',
              fontWeight: 600
            }}>
            {format === 'markdown'
              ? 'Markdown Preview'
              : format === 'pdf'
                ? 'PDF Preview'
                : format === 'docx'
                  ? 'Word Preview'
                  : 'Text Preview'}
          </h2>
          <div className={styles.headerActions}>
            {/* Removed Export PDF button to maintain consistent UI across all preview modals */}
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
              style={{
                color: 'var(--text-color, #333333)'
              }}>
              &times;
            </button>
          </div>
        </div>
        <div
          className={styles.modalBody}
          style={{
            backgroundColor: 'var(--pdf-background-color, var(--bg-tertiary, #f9f9f9))'
          }}>
          {format === 'markdown' ? (
            <div
              ref={markdownRef}
              className={styles.markdownPreview}
              style={{
                backgroundColor: 'var(--pdf-background-color, var(--bg-primary, #ffffff))',
                color: 'var(--pdf-text-color, var(--text-color, #333333))',
                borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))',
                fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, "Helvetica Neue", Arial, sans-serif)))'
              }}>
              <StyledMarkdown>{content}</StyledMarkdown>
            </div>
          ) : format === 'pdf' ? (
            <div
              className={styles.pdfPreview}
              style={{
                borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))'
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
              {pdfDataUrl ? (
                <iframe
                  src={pdfDataUrl}
                  className={styles.pdfFrame}
                  title="PDF Preview (Data URL)"
                />
              ) : (
                <iframe
                  src={`${pdfSource}?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className={styles.pdfFrame}
                  title="PDF Preview (File)"
                />
              )}
            </div>
          ) : format === 'docx' ? (
            <div
              className={styles.markdownPreview}
              style={{
                backgroundColor: 'var(--pdf-background-color, var(--bg-primary, #ffffff))',
                color: 'var(--pdf-text-color, var(--text-color, #333333))',
                borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))',
                fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, "Helvetica Neue", Arial, sans-serif)))'
              }}>
              <div className={styles.docxPreviewMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.docxIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>Word Document Preview</h3>
                <p>A Microsoft Word document has been generated and is ready for download. Click the download button below to save the document.</p>
                <div className={styles.docxPreviewContent}>
                  <StyledMarkdown>{content}</StyledMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <pre
              ref={textRef}
              className={styles.textPreview}
              style={{
                backgroundColor: 'var(--pdf-background-color, var(--bg-primary, #ffffff))',
                color: 'var(--pdf-text-color, var(--text-color, #333333))',
                borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))',
                fontFamily: 'var(--pdf-mono-font, var(--font-mono, var(--dynamic-mono-font, "Courier New", monospace)))'
              }}>{content}</pre>
          )}
        </div>
        <div
          className={styles.modalFooter}
          style={{
            borderTopColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))'
          }}>
          <button
            className={styles.downloadButton}
            style={{
              backgroundColor: 'var(--pdf-accent-color, var(--cta-primary, var(--dynamic-accent, #7E4E2D)))',
              color: 'var(--pdf-background-color, var(--bg-primary, #ffffff))',
              fontFamily: 'var(--pdf-button-font, var(--font-button, var(--dynamic-heading-font, "Helvetica Neue", Arial, sans-serif)))',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }}
            onClick={async (e) => {
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
                DanteLogger.success.basic(`Starting download of ${fileName}.${
                  format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                }`);

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
                  } catch (directError) {
                    console.error('Direct download failed:', directError);

                    // If direct download fails, try the handler
                    if (onDownloadWithDataUrl) {
                      console.log('Falling back to data URL handler');
                      try {
                        await onDownloadWithDataUrl(pdfDataUrl);
                        downloadStarted = true;
                        console.log('Data URL handler download completed');
                      } catch (handlerError) {
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
                  } catch (directError) {
                    console.error('Direct source download failed:', directError);

                    // If direct download fails, try the handler
                    console.log('Falling back to default handler');
                    try {
                      await onDownload();
                      downloadStarted = true;
                      console.log('Default handler download completed');
                    } catch (handlerError) {
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
                  } catch (handlerError) {
                    console.error(`${format} handler download failed:`, handlerError);
                    throw handlerError; // Re-throw to be caught by outer try/catch
                  }
                }

                // Log success if download started
                if (downloadStarted) {
                  console.log('Download successfully initiated');
                  DanteLogger.success.ux(`Downloaded ${fileName}.${
                    format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                  }`);

                  // Only close the modal after a longer delay to ensure download starts
                  console.log('Setting timeout to close modal');
                  setTimeout(() => {
                    console.log('Closing modal after download');
                    onClose();
                  }, 2000); // Even longer delay for more reliable downloads
                } else {
                  console.error('No download method succeeded');
                  throw new Error('No download method succeeded');
                }
              } catch (error) {
                console.error('Error during download process:', error);
                DanteLogger.error.runtime(`Download failed: ${error}`);
                alert('There was an error downloading the file. Please try again.');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download {
              format === 'markdown'
                ? 'Markdown'
                : format === 'pdf'
                  ? 'PDF'
                  : format === 'docx'
                    ? 'Word'
                    : 'Text'
            } File
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            style={{
              backgroundColor: 'var(--pdf-secondary-color, var(--cta-tertiary-bg, rgba(126, 98, 51, 0.1)))',
              color: 'var(--pdf-text-color, var(--text-color, #333333))',
              borderColor: 'var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.2)))',
              fontFamily: 'var(--pdf-button-font, var(--font-button, var(--dynamic-heading-font, "Helvetica Neue", Arial, sans-serif)))',
              fontWeight: 600
            }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
