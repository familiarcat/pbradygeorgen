'use client';

import React, { useEffect, useRef } from 'react';
import styles from '@/styles/PreviewModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import ReactMarkdown from 'react-markdown';

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
        }`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {format === 'markdown'
              ? 'Markdown Preview'
              : format === 'pdf'
                ? 'PDF Preview'
                : 'Text Preview'}
          </h2>
          <div className={styles.headerActions}>
            {/* Removed Export PDF button to maintain consistent UI across all preview modals */}
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
            <pre ref={textRef} className={styles.textPreview}>{content}</pre>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.downloadButton}
            onClick={async () => {
              try {
                // Enhanced logging for debugging
                console.log('Download button clicked with:', {
                  format,
                  fileName,
                  hasPdfDataUrl: !!pdfDataUrl,
                  hasDataUrlHandler: !!onDownloadWithDataUrl
                });

                DanteLogger.success.basic(`Starting download of ${fileName}.${
                  format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                }`);

                // For PDF format with data URL
                if (format === 'pdf' && pdfDataUrl && onDownloadWithDataUrl) {
                  console.log('Using data URL download handler');

                  // Create a direct download link as a fallback mechanism
                  const link = document.createElement('a');
                  link.href = pdfDataUrl;
                  link.download = `${fileName}.pdf`;

                  try {
                    // Try the handler first
                    await onDownloadWithDataUrl(pdfDataUrl);
                  } catch (handlerError) {
                    console.error('Handler failed, using direct download:', handlerError);
                    // If handler fails, use direct download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }
                // For PDF format without data URL but with source
                else if (format === 'pdf' && !pdfDataUrl && pdfSource) {
                  console.log('Using default download handler for PDF with source:', pdfSource);
                  await onDownload();
                }
                // For all other formats
                else {
                  console.log('Using default download handler');
                  await onDownload();
                }

                // Log success after download completes
                DanteLogger.success.ux(`Downloaded ${fileName}.${
                  format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
                }`);

                // Only close the modal after a longer delay to ensure download starts
                console.log('Setting timeout to close modal');
                setTimeout(() => {
                  console.log('Closing modal after download');
                  onClose();
                }, 800); // Increased delay for more reliable downloads
              } catch (error) {
                console.error('Error during download:', error);
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
    </div>
  );
};

export default PreviewModal;
