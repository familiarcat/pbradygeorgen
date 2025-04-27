'use client';

import React, { useEffect, useRef } from 'react';
import styles from '@/styles/PreviewModal.module.css';
import axiomStyles from '@/styles/AxiomUI.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import ReactMarkdown from 'react-markdown';
import AxiomContainer from './AxiomContainer';
import AxiomTransition from './AxiomTransition';
import { useAxiom } from './AxiomProvider';

interface AxiomPreviewModalProps {
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

const AxiomPreviewModal: React.FC<AxiomPreviewModalProps> = ({
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
  
  // Get Axiom context
  const { registerChoice, unregisterChoice, selectChoice } = useAxiom();
  
  // Register this modal with the Axiom system when it opens
  useEffect(() => {
    if (isOpen) {
      const modalId = `preview-modal-${format}-${fileName}`;
      
      registerChoice(modalId, {
        position: position as 'left' | 'right' | 'center',
        priority: 2, // Higher priority for modals
      });
      
      // Select this choice to make it active
      selectChoice(modalId);
      
      return () => {
        unregisterChoice(modalId);
      };
    }
  }, [isOpen, format, fileName, position, registerChoice, unregisterChoice, selectChoice]);

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
    <AxiomTransition
      show={isOpen}
      type="fade"
      duration={300}
    >
      <div className={styles.modalOverlay}>
        <AxiomContainer
          id={`preview-modal-${format}-${fileName}`}
          initialPosition={position as 'left' | 'right' | 'center'}
          className={`${styles.modalContent} ${
            position === 'left'
              ? styles.modalContentLeft
              : position === 'right'
                ? styles.modalContentRight
                : ''
          }`}
        >
          <div
            ref={modalRef}
            className={`${axiomStyles.axiomTransitionScale} ${axiomStyles.axiomTransitionActive}`}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {format === 'markdown'
                  ? 'Markdown Preview'
                  : format === 'pdf'
                    ? 'PDF Preview'
                    : 'Text Preview'}
              </h2>
              <div className={styles.headerActions}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                  &times;
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              {format === 'markdown' ? (
                <div ref={markdownRef} className={styles.markdownPreview}>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : format === 'pdf' ? (
                <div className={styles.pdfPreview}>
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
                <pre ref={textRef} className={styles.textPreview}>{content}</pre>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.downloadButton}
                onClick={async (e) => {
                  e.preventDefault(); // Prevent any default behavior
                  e.stopPropagation(); // Stop event propagation

                  try {
                    DanteLogger.success.basic(`Starting download of ${fileName}.${
                      format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                    }`);

                    // DO NOT CLOSE THE MODAL YET - We'll handle this after download
                    let downloadStarted = false;

                    // For PDF format with data URL - DIRECT DOWNLOAD APPROACH
                    if (format === 'pdf' && pdfDataUrl) {
                      try {
                        // Create a direct download link
                        const link = document.createElement('a');
                        link.href = pdfDataUrl;
                        link.download = `${fileName}.pdf`;
                        document.body.appendChild(link);

                        // Force the download to happen synchronously
                        link.click();
                        document.body.removeChild(link);
                        downloadStarted = true;
                      } catch (directError) {
                        console.error('Direct download failed:', directError);

                        // If direct download fails, try the handler
                        if (onDownloadWithDataUrl) {
                          try {
                            await onDownloadWithDataUrl(pdfDataUrl);
                            downloadStarted = true;
                          } catch (handlerError) {
                            throw handlerError; // Re-throw to be caught by outer try/catch
                          }
                        }
                      }
                    }
                    // For PDF format without data URL but with source
                    else if (format === 'pdf' && !pdfDataUrl && pdfSource) {
                      try {
                        // Create a direct download link for the source
                        const link = document.createElement('a');
                        link.href = pdfSource;
                        link.download = `${fileName}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        downloadStarted = true;
                      } catch (directError) {
                        console.error('Direct source download failed:', directError);

                        // If direct download fails, try the handler
                        try {
                          await onDownload();
                          downloadStarted = true;
                        } catch (handlerError) {
                          throw handlerError; // Re-throw to be caught by outer try/catch
                        }
                      }
                    }
                    // For all other formats (markdown, text)
                    else {
                      try {
                        await onDownload();
                        downloadStarted = true;
                      } catch (handlerError) {
                        throw handlerError; // Re-throw to be caught by outer try/catch
                      }
                    }

                    // Log success if download started
                    if (downloadStarted) {
                      DanteLogger.success.ux(`Downloaded ${fileName}.${
                        format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                      }`);

                      // Only close the modal after a longer delay to ensure download starts
                      setTimeout(() => {
                        onClose();
                      }, 2000); // Even longer delay for more reliable downloads
                    } else {
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
              <button className={styles.cancelButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </AxiomContainer>
      </div>
    </AxiomTransition>
  );
};

export default AxiomPreviewModal;
