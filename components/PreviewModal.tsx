'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/PreviewModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import ReactMarkdown from 'react-markdown';
import PdfGenerator from '@/utils/PdfGenerator';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  format: 'markdown' | 'text' | 'pdf';
  fileName: string;
  onDownload: () => void;
  position?: 'left' | 'right' | 'center';
  pdfSource?: string; // Optional PDF source for preview
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  format,
  fileName,
  onDownload,
  position = 'center',
  pdfSource = '/pbradygeorgen_resume.pdf' // Default to resume PDF
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLPreElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Function to handle PDF export
  const handleExportToPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      if (format === 'markdown' && markdownRef.current) {
        await PdfGenerator.generatePdfFromElement(markdownRef.current, {
          title: `${fileName} Summary`,
          fileName: `${fileName}.pdf`,
          headerText: 'P. Brady Georgen - Summary'
        });
        DanteLogger.success.ux(`Exported ${fileName}.pdf using Salinger design principles`);
      } else if (format === 'text' && textRef.current) {
        await PdfGenerator.generatePdfFromElement(textRef.current, {
          title: `${fileName} Summary`,
          fileName: `${fileName}.pdf`,
          headerText: 'P. Brady Georgen - Summary'
        });
        DanteLogger.success.ux(`Exported ${fileName}.pdf using Salinger design principles`);
      } else if (format === 'markdown') {
        // If ref is not available, use the content directly
        await PdfGenerator.generatePdfFromMarkdown(content, {
          title: `${fileName} Summary`,
          fileName: `${fileName}.pdf`,
          headerText: 'P. Brady Georgen - Summary'
        });
        DanteLogger.success.ux(`Exported ${fileName}.pdf using Salinger design principles`);
      }
    } catch (error) {
      DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

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
            {format !== 'pdf' && (
              <button
                className={styles.pdfExportButton}
                onClick={handleExportToPdf}
                disabled={isGeneratingPdf}
                aria-label="Export to PDF"
              >
                {isGeneratingPdf ? (
                  <span className={styles.loadingText}>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.pdfIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Export PDF
                  </>
                )}
              </button>
            )}
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
              <iframe
                src={`${pdfSource}?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className={styles.pdfFrame}
                title="PDF Preview"
              />
            </div>
          ) : (
            <pre ref={textRef} className={styles.textPreview}>{content}</pre>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.downloadButton}
            onClick={() => {
              onDownload();
              DanteLogger.success.ux(`Downloaded ${fileName}.${
                format === 'markdown' ? 'md' : format === 'pdf' ? 'pdf' : 'txt'
              }`);
              onClose();
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
