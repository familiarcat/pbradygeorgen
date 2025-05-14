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
  format: 'markdown' | 'text' | 'pdf';
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
          backgroundColor: 'var(--bg-primary, #ffffff)',
          color: 'var(--text-color, #333333)',
          borderColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
        }}>
        <div
          className={styles.modalHeader}
          style={{
            backgroundColor: 'var(--bg-secondary, #f5f5f5)',
            borderBottomColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
          }}>
          <h2
            className={styles.modalTitle}
            style={{
              color: 'var(--text-color, #333333)',
              fontFamily: 'var(--font-heading, sans-serif)'
            }}>
            {format === 'markdown'
              ? 'Markdown Preview'
              : format === 'pdf'
                ? 'PDF Preview'
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
            backgroundColor: 'var(--bg-tertiary, #f9f9f9)'
          }}>
          {format === 'markdown' ? (
            <div
              ref={markdownRef}
              className={styles.markdownPreview}
              style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-color, #333333)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))',
                fontFamily: 'var(--font-body, serif)'
              }}>
              <StyledMarkdown>{content}</StyledMarkdown>
            </div>
          ) : format === 'pdf' ? (
            <div
              className={styles.pdfPreview}
              style={{
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
          ) : (
            <pre
              ref={textRef}
              className={styles.textPreview}
              style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-color, #333333)',
                borderColor: 'var(--border-color, rgba(73, 66, 61, 0.1))',
                fontFamily: 'var(--font-mono, monospace)'
              }}>{content}</pre>
          )}
        </div>
        <div
          className={styles.modalFooter}
          style={{
            borderTopColor: 'var(--border-color, rgba(73, 66, 61, 0.2))'
          }}>
          <button
            className={styles.downloadButton}
            style={{
              backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))',
              color: 'var(--text-color, #333333)',
              fontFamily: 'var(--font-button, sans-serif)'
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
                  : 'Text'
            } File
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            style={{
              backgroundColor: 'var(--cta-tertiary-bg, rgba(126, 98, 51, 0.1))',
              color: 'var(--text-color, #333333)',
              borderColor: 'var(--border-color, rgba(73, 66, 61, 0.2))',
              fontFamily: 'var(--font-button, sans-serif)'
            }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
