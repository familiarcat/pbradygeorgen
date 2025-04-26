'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SummaryModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import ReactMarkdown from 'react-markdown';
import PdfGenerator from '@/utils/PdfGenerator';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onRefreshAnalysis: () => void;
  position?: 'left' | 'right' | 'center';
  isLoading?: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  content,
  onRefreshAnalysis,
  position = 'left',
  isLoading = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Function to handle PDF export
  const handleExportToPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      // Always use the markdown content directly to avoid styling issues
      await PdfGenerator.generatePdfFromMarkdown(content, {
        title: 'P. Brady Georgen - Summary',
        fileName: 'pbradygeorgen_summary.pdf',
        headerText: 'P. Brady Georgen - Summary',
        footerText: 'Generated with Salinger Design'
      });
      DanteLogger.success.ux('Exported summary as PDF using Salinger design principles');
    } catch (error) {
      DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
      alert('There was an error generating the PDF. Please try again.');
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
          <h2 className={styles.modalTitle}>Summary</h2>
          <div className={styles.headerActions}>
            <button
              className={styles.refreshButton}
              onClick={onRefreshAnalysis}
              aria-label="Refresh Analysis"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.refreshIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
              </svg>
              Refresh Analysis
            </button>
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
                  Download PDF
                </>
              )}
            </button>
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
    </div>
  );
};

export default SummaryModal;
