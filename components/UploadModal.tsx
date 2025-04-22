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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upload Resume PDF</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="mb-4 text-[var(--text-secondary)]">
          Upload a resume PDF to analyze its content and generate downloadable formats.
        </p>
        
        {!uploadSuccess ? (
          <PDFUploader 
            onPdfUploaded={handlePdfUploaded}
            className="mb-4"
          />
        ) : (
          <div className="text-center p-4 bg-[var(--state-success-light, #e6f7e6)] rounded-lg mb-4">
            <svg 
              className="w-12 h-12 mx-auto mb-2 text-[var(--state-success, #28a745)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <p className="text-lg font-medium text-[var(--text-primary)]">
              PDF uploaded successfully!
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
