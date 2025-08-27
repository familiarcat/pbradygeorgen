'use client';

import { useState, useEffect, useRef } from 'react';
import PDFUploader from './PDFUploader';
import { DanteLogger } from '@/utils/DanteLogger';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPdfUploaded: (pdfUrl: string, fileName: string) => void;
}

export default function UploadModal({ isOpen, onClose, onPdfUploaded }: UploadModalProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle escape key to close the modal
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handlePdfUploaded = (url: string, fileName: string) => {
    setUploadSuccess(true);
    DanteLogger.success.ux('PDF uploaded successfully', { fileName });

    // Call the parent callback
    onPdfUploaded(url, fileName);

    // Close the modal after a short delay
    setTimeout(() => {
      onClose();
      // Reset the success state after the modal is closed
      setTimeout(() => setUploadSuccess(false), 300);
    }, 1500);
  };

  // Feature temporarily disabled
  return null;

  /* Original implementation updated with theme variables:
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
         style={{ backgroundColor: 'var(--pdf-modal-overlay, rgba(0, 0, 0, 0.5))' }}>
      <div
        ref={modalRef}
        className="rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-primary, #ffffff)',
          color: 'var(--text-color, #333333)',
          border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))',
          boxShadow: 'var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
      */
}
