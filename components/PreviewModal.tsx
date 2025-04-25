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
  onDownload: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  format,
  fileName,
  onDownload
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
      <div ref={modalRef} className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {format === 'markdown'
              ? 'Markdown Preview'
              : format === 'pdf'
                ? 'PDF Preview'
                : 'Text Preview'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {format === 'markdown' ? (
            <div className={styles.markdownPreview}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : format === 'pdf' ? (
            <div className={styles.pdfPreview}>
              <iframe
                src={`/pbradygeorgen_resume.pdf?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className={styles.pdfFrame}
                title="PDF Preview"
              />
            </div>
          ) : (
            <pre className={styles.textPreview}>{content}</pre>
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
