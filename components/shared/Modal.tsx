'use client';

/**
 * Base Modal Component
 * 
 * A reusable modal component that follows our shared philosophical frameworks:
 * - Salinger: Intuitive UX with consistent component behavior
 * - Hesse: Mathematical harmony in component proportions
 * - Derrida: Deconstruction through CSS variables
 * - Müller-Brockmann: Grid-based design with consistent sizing
 * 
 * This component serves as the foundation for all modals in the application,
 * ensuring consistent behavior, styling, and accessibility.
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/SharedModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { usePdfThemeContext } from '@/components/DynamicThemeProvider';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Optional header actions (right side of header) */
  headerActions?: React.ReactNode;
  /** Optional CSS class name for the modal content */
  className?: string;
  /** Optional position of the modal (left, right, or center) */
  position?: 'left' | 'right' | 'center';
  /** Optional ID for the modal */
  id?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Optional aria-describedby for accessibility */
  ariaDescribedby?: string;
  /** Optional z-index for the modal */
  zIndex?: number;
  /** Optional callback when the modal has opened */
  onOpen?: () => void;
  /** Optional callback when the modal is about to close */
  onBeforeClose?: () => Promise<boolean> | boolean;
  /** Optional flag to disable closing on overlay click */
  disableOverlayClick?: boolean;
  /** Optional flag to disable closing on escape key */
  disableEscapeKey?: boolean;
}

/**
 * Base Modal Component
 * 
 * A reusable modal component that provides consistent behavior and styling
 * for all modals in the application.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  headerActions,
  className = '',
  position = 'center',
  id,
  ariaLabel,
  ariaDescribedby,
  zIndex,
  onOpen,
  onBeforeClose,
  disableOverlayClick = false,
  disableEscapeKey = false,
}) => {
  // State to track if the modal is mounted in the DOM
  const [isMounted, setIsMounted] = useState(false);
  
  // Ref for the modal content element
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Access the PDF theme context to use extracted styles
  const themeContext = usePdfThemeContext();

  // Effect to handle mounting/unmounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Effect to handle modal open/close
  useEffect(() => {
    if (isOpen) {
      // Log modal opening
      DanteLogger.success.ux(`Modal opened: ${title}`);
      HesseLogger.summary.start(`Modal: ${title}`);
      
      // Call onOpen callback if provided
      if (onOpen) {
        onOpen();
      }
      
      // Add body class to prevent scrolling
      document.body.classList.add('modal-open');
      
      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Remove body class when modal is closed
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onOpen, title]);

  // Effect to handle escape key press
  useEffect(() => {
    const handleEscapeKey = async (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape' && !disableEscapeKey) {
        event.preventDefault();
        
        // Check if we can close the modal
        if (onBeforeClose) {
          const canClose = await onBeforeClose();
          if (canClose) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };
    
    // Add event listener for escape key
    document.addEventListener('keydown', handleEscapeKey);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, onBeforeClose, disableEscapeKey]);

  // Handle overlay click
  const handleOverlayClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the overlay (not its children)
    if (event.target === event.currentTarget && !disableOverlayClick) {
      // Check if we can close the modal
      if (onBeforeClose) {
        const canClose = await onBeforeClose();
        if (canClose) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  // Handle close button click
  const handleCloseClick = async () => {
    // Check if we can close the modal
    if (onBeforeClose) {
      const canClose = await onBeforeClose();
      if (canClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Determine modal position class
  const positionClass = position === 'left' 
    ? styles.modalContentLeft 
    : position === 'right' 
      ? styles.modalContentRight 
      : '';

  // If not mounted or not open, don't render anything
  if (!isMounted || !isOpen) {
    return null;
  }

  // Create the modal content
  const modalContent = (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
      style={zIndex ? { zIndex } : undefined}
      data-testid="modal-overlay"
    >
      <div 
        ref={modalRef}
        className={`${styles.modalContent} ${positionClass} ${className}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id ? `${id}-title` : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        id={id}
        data-testid="modal-content"
      >
        <div className={styles.modalHeader}>
          <h2 
            className={styles.modalTitle}
            id={id ? `${id}-title` : undefined}
          >
            {title}
          </h2>
          <div className={styles.headerActions}>
            {headerActions}
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleCloseClick}
              aria-label="Close modal"
              data-testid="modal-close-button"
            >
              &times;
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document body level
  return createPortal(
    modalContent,
    document.body
  );
};

export default Modal;
