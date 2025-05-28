/**
 * DownloadDropdown Component
 *
 * A universal dropdown component for handling document downloads and previews
 * that can be used consistently across the application.
 *
 * This component follows:
 * - Derrida philosophy by deconstructing hardcoded download implementations
 * - Müller-Brockmann philosophy with clean, grid-based structure
 * - Hesse philosophy by ensuring mathematical harmony in implementation patterns
 * - Dante philosophy with methodical logging
 * - Kantian ethics by maintaining professional business orientation
 */

import React, { useState, useEffect, useRef } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import DocxDownloadHandler from './DocxDownloadHandler';
import styles from '@/styles/DownloadDropdown.module.css';

export interface DownloadOption {
  format: 'pdf' | 'markdown' | 'text' | 'docx';
  buttonText: string;
  isLoading: boolean;
  onPreview: () => void;
  onDownload: () => void;
}

interface DownloadDropdownProps {
  // Content and file information
  title: string;
  documentType: 'resume' | 'introduction';
  fileName: string;
  
  // Download options
  options: DownloadOption[];
  
  // UI customization
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  iconClassName?: string;
  
  // Optional callbacks
  onOpen?: () => void;
  onClose?: () => void;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({
  // Content and file information
  title,
  documentType,
  fileName,
  
  // Download options
  options,
  
  // UI customization
  className = '',
  buttonClassName = '',
  menuClassName = '',
  iconClassName = '',
  
  // Optional callbacks
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
    
    DanteLogger.success.basic(`${newState ? 'Opened' : 'Closed'} ${documentType} download dropdown`);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          if (onClose) onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className={`${styles.downloadDropdown} ${className}`}>
      {/* Main dropdown button */}
      <button
        className={`${styles.dropdownButton} ${buttonClassName}`}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Download ${title}`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${styles.downloadIcon} ${iconClassName}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download {title}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`${styles.dropdownMenu} ${menuClassName}`}>
          {options.map((option, index) => (
            <div key={`${option.format}-${index}`} className={styles.downloadOptionGroup}>
              {/* Preview button */}
              <button
                className={styles.previewButton}
                onClick={() => {
                  HesseLogger.summary.start(`Opening ${option.format} preview for ${documentType}`);
                  option.onPreview();
                  setIsOpen(false);
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={styles.previewIcon} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </button>

              {/* Download button */}
              <button
                className={styles.downloadOption}
                onClick={() => {
                  HesseLogger.summary.start(`Downloading ${option.format} for ${documentType}`);
                  option.onDownload();
                  setIsOpen(false);
                }}
                disabled={option.isLoading}
              >
                {option.isLoading ? (
                  <span className={styles.loadingText}>
                    <svg 
                      className={styles.loadingSpinner} 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </span>
                ) : (
                  <>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={styles.downloadIcon} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    {option.buttonText}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;
